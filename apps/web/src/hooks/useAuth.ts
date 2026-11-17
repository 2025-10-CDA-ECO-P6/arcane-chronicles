import type { LoginInput } from '@arcane-chronicles/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useArcane } from '@/context/ArcaneContext';
import { ApiError, apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

const DEFAULT_REDIRECT = '/dashboard';

const getSafeRedirect = (redirectTo?: string) =>
  redirectTo?.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : DEFAULT_REDIRECT;

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    return 'Email ou mot de passe incorrect';
  }
  if (error instanceof ApiError && error.status === 429) {
    return 'Trop de tentatives de connexion, réessayez dans 15 minutes';
  }
  return 'Une erreur est survenue, réessayez plus tard';
};

export function useAuth() {
  const router = useRouter();
  const { handleUser } = useArcane();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const clearError = () => setError(undefined);

  const login = async (credentials: LoginInput, redirectTo?: string) => {
    if (isLoading) {
      return null;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const user = await apiFetch.post<AuthUser>('/auth/login', credentials);
      handleUser(user);
      router.push(getSafeRedirect(redirectTo));
      router.refresh();
      return user;
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
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

  return { login, logout, isLoading, error, clearError };
}
