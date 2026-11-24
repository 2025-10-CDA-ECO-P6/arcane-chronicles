import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  type LoginInput,
  loginSchema,
  registerSchema,
} from '@arcane-chronicles/shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useArcane } from '@/context/ArcaneContext';
import { ApiError, apiFetch } from '@/lib/api';
import type { AuthField, AuthFieldErrors, AuthUser, RegisterValues } from '@/types/auth';

const DEFAULT_REDIRECT = '/dashboard/campaigns';
const LOCK_STORAGE_KEY = 'arcane-chronicles:login-locked-until';

const LOGIN_FIELD_MESSAGES: AuthFieldErrors = {
  email: 'Adresse e-mail invalide',
  password: 'Mot de passe obligatoire',
};

const REGISTER_FIELD_MESSAGES: AuthFieldErrors = {
  displayName: `Le pseudonyme doit contenir entre ${DISPLAY_NAME_MIN_LENGTH} et ${DISPLAY_NAME_MAX_LENGTH} caractères`,
  email: 'Adresse e-mail invalide',
  password: 'Le mot de passe ne respecte pas toutes les règles',
};

const PASSWORD_MISMATCH_MESSAGE = 'Les mots de passe ne correspondent pas';

const toFieldErrors = (issues: { path: PropertyKey[] }[], messages: AuthFieldErrors) =>
  issues.reduce<AuthFieldErrors>((errors, issue) => {
    const field = issue.path[0] as AuthField;
    return messages[field] ? { ...errors, [field]: messages[field] } : errors;
  }, {});

const getSafeRedirect = (redirectTo?: string) => {
  if (!redirectTo?.startsWith('/')) {
    return DEFAULT_REDIRECT;
  }

  try {
    const { origin } = window.location;
    const url = new URL(redirectTo, origin);
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
};

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 401) {
    return 'Email ou mot de passe incorrect';
  }
  if (error instanceof ApiError && error.status === 429) {
    return 'Trop de tentatives de connexion, réessayez plus tard';
  }
  return 'Une erreur est survenue, réessayez plus tard';
};

const getRegisterErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 409) {
    return 'Un compte existe déjà avec cet e-mail';
  }
  if (error instanceof ApiError && error.status === 429) {
    return "Trop de tentatives d'inscription, réessayez plus tard";
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
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
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

  const clearFieldError = (field: AuthField) => {
    setFieldErrors((current) => {
      const clearsMismatch =
        field === 'password' && current.passwordConfirmation === PASSWORD_MISMATCH_MESSAGE;
      if (!current[field] && !clearsMismatch) {
        return current;
      }
      return {
        ...current,
        [field]: undefined,
        ...(clearsMismatch && { passwordConfirmation: undefined }),
      };
    });
    clearError();
  };

  const login = async (values: LoginInput, redirectTo?: string) => {
    if (isLoading || lockedUntil) {
      return null;
    }

    clearError();
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error.issues, LOGIN_FIELD_MESSAGES));
      return null;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const user = await apiFetch.post<AuthUser>('/auth/login', result.data);
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

  const register = async ({ passwordConfirmation, ...registration }: RegisterValues) => {
    if (isLoading) {
      return null;
    }

    clearError();
    const result = registerSchema.safeParse(registration);
    const errors = result.success
      ? {}
      : toFieldErrors(result.error.issues, REGISTER_FIELD_MESSAGES);
    if (passwordConfirmation !== registration.password) {
      errors.passwordConfirmation = PASSWORD_MISMATCH_MESSAGE;
    }
    if (!result.success || errors.passwordConfirmation) {
      setFieldErrors(errors);
      return null;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const user = await apiFetch.post<AuthUser>('/auth/register', result.data);
      handleUser(user);
      router.push(DEFAULT_REDIRECT);
      router.refresh();
      return user;
    } catch (registerError) {
      setError(getRegisterErrorMessage(registerError));
      setIsLoading(false);
      return null;
    }
  };

  const logout = async () => {
    setError(undefined);

    try {
      await apiFetch.post('/auth/logout');
    } catch {
      setError('La déconnexion a échoué, réessayez plus tard');
      return false;
    }

    handleUser(null);
    router.push('/login');
    router.refresh();
    return true;
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    fieldErrors,
    clearError,
    clearFieldError,
    hasInvalidCredentials,
    isLocked: lockedUntil !== undefined,
    lockedMinutes: lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 60000) : 0,
  };
}
