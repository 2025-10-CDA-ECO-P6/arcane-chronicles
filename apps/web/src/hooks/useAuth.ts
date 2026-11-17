import type { LoginInput } from '@arcane-chronicles/shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useArcane } from '@/context/ArcaneContext';
import { ApiError, apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

const DEFAULT_REDIRECT = '/dashboard';
const LOCK_STORAGE_KEY = 'arcane-chronicles:login-locked-until';

const getSafeRedirect = (redirectTo?: string) =>
  redirectTo?.startsWith('/') && !/^\/[/\\]/.test(redirectTo) ? redirectTo : DEFAULT_REDIRECT;

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    return 'Email ou mot de passe incorrect';
  }
  if (error instanceof ApiError && error.status === 429) {
    return 'Trop de tentatives de connexion, réessayez plus tard';
  }
  return 'Une erreur est survenue, réessayez plus tard';
};

const getRetryAfterSeconds = (error: unknown) => {
  if (!(error instanceof ApiError) || error.status !== 429) {
    return undefined;
  }
  const retryAfter = (error.data as { retryAfter?: unknown } | null)?.retryAfter;
  return typeof retryAfter === 'number' && retryAfter > 0 ? retryAfter : undefined;
};

const readLockedUntil = () => {
  try {
    const value = Number(localStorage.getItem(LOCK_STORAGE_KEY));
    return value > Date.now() ? value : undefined;
  } catch {
    return undefined;
  }
};

const storeLockedUntil = (value?: number) => {
  try {
    if (value) {
      localStorage.setItem(LOCK_STORAGE_KEY, String(value));
    } else {
      localStorage.removeItem(LOCK_STORAGE_KEY);
    }
  } catch {
    return;
  }
};

export function useAuth() {
  const router = useRouter();
  const { handleUser } = useArcane();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number>();

  useEffect(() => {
    setLockedUntil(readLockedUntil());
  }, []);

  useEffect(() => {
    if (!lockedUntil) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setLockedUntil(undefined);
      storeLockedUntil(undefined);
    }, lockedUntil - Date.now());
    return () => clearTimeout(timer);
  }, [lockedUntil]);

  const clearError = () => {
    setError(undefined);
    setHasInvalidCredentials(false);
  };

  const login = async (credentials: LoginInput, redirectTo?: string) => {
    if (isLoading || lockedUntil) {
      return null;
    }

    setIsLoading(true);
    clearError();

    try {
      const user = await apiFetch.post<AuthUser>('/auth/login', credentials);
      handleUser(user);
      router.push(getSafeRedirect(redirectTo));
      router.refresh();
      return user;
    } catch (loginError) {
      const retryAfter = getRetryAfterSeconds(loginError);
      if (retryAfter) {
        const until = Date.now() + retryAfter * 1000;
        setLockedUntil(until);
        storeLockedUntil(until);
      } else {
        setError(getLoginErrorMessage(loginError));
        setHasInvalidCredentials(loginError instanceof ApiError && loginError.status === 401);
      }
      setIsLoading(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      await apiFetch.post('/auth/logout');
    } finally {
      handleUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  return {
    login,
    logout,
    isLoading,
    error,
    clearError,
    hasInvalidCredentials,
    isLocked: lockedUntil !== undefined,
    lockedMinutes: lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 60000) : 0,
  };
}
