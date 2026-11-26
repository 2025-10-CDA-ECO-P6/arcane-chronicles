import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useArcane } from '@/context/ArcaneContext';
import { ApiError, apiFetch } from '@/lib/api';
import { useAuth } from './useAuth';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));
vi.mock('@/context/ArcaneContext', () => ({ useArcane: vi.fn() }));
vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: { post: vi.fn() },
}));

const push = vi.fn();
const refresh = vi.fn();
const handleUser = vi.fn();
const user = { id: '1', displayName: 'Maître Ying', email: 'mj@example.com', avatarUrl: null };
const credentials = { email: 'mj@example.com', password: 'secret' };
const registerValues = {
  displayName: 'Maître Ying',
  email: 'mj@example.com',
  password: 'Archipel-du-n3ant',
  passwordConfirmation: 'Archipel-du-n3ant',
};
const LOCK_KEY = 'arcane-chronicles:login-locked-until';
const tooManyAttempts = (retryAfter?: number) =>
  new ApiError(429, retryAfter ? { message: 'Too many', retryAfter } : null, '/auth/login');

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(useRouter).mockReturnValue({ push, refresh } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(useArcane).mockReturnValue({
      currentUser: null,
      isAuthenticated: false,
      handleUser,
      isSidebarOpen: true,
      toggleSidebar: vi.fn(),
    });
  });

  it('stores the user and goes to the dashboard after a successful login', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials));

    expect(apiFetch.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(handleUser).toHaveBeenCalledWith(user);
    expect(push).toHaveBeenCalledWith('/dashboard/campaigns');
    expect(refresh).toHaveBeenCalled();
  });

  it('goes back to the requested page when it is a local path', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials, '/campaigns/42?tab=quests'));

    expect(push).toHaveBeenCalledWith('/campaigns/42?tab=quests');
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    '/\t/evil.example',
    '/\n/evil.example',
    'javascript:alert(1)',
  ])('refuses the unsafe redirect target %s', async (target) => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials, target));

    expect(push).toHaveBeenCalledWith('/dashboard/campaigns');
  });

  it.each([
    [401, 'Email ou mot de passe incorrect'],
    [429, 'Trop de tentatives de connexion, réessayez plus tard'],
    [500, 'Une erreur est survenue, réessayez plus tard'],
  ])('shows a French message on a %i response', async (status, message) => {
    vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(status, null, '/auth/login'));
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials));

    expect(result.current.error).toBe(message);
    expect(result.current.hasInvalidCredentials).toBe(status === 401);
    expect(result.current.isLoading).toBe(false);
    expect(handleUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('gives French field errors and does not call the API when the login form is invalid', async () => {
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login({ email: '', password: '' }));

    expect(result.current.fieldErrors).toEqual({
      email: 'Adresse e-mail invalide',
      password: 'Mot de passe obligatoire',
    });
    expect(apiFetch.post).not.toHaveBeenCalled();
  });

  it('sends the cleaned email', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login({ email: '  MJ@Example.com ', password: 'secret' }));

    expect(apiFetch.post).toHaveBeenCalledWith('/auth/login', credentials);
  });

  it('clears one field error and the API error when that field changes', async () => {
    vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(401, null, '/auth/login'));
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login({ email: '', password: '' }));
    await act(() => result.current.login(credentials));

    act(() => result.current.clearFieldError('email'));

    expect(result.current.fieldErrors.email).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.hasInvalidCredentials).toBe(false);
  });

  it('clears the error on demand', async () => {
    vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(401, null, '/auth/login'));
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login(credentials));

    act(() => result.current.clearError());

    expect(result.current.error).toBeUndefined();
    expect(result.current.hasInvalidCredentials).toBe(false);
  });

  it('logs out and goes to the login page', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.logout());

    expect(apiFetch.post).toHaveBeenCalledWith('/auth/logout');
    expect(handleUser).toHaveBeenCalledWith(null);
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('stays logged in and shows an error when the logout call fails', async () => {
    vi.mocked(apiFetch.post).mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.logout());

    expect(result.current.error).toBe('La déconnexion a échoué, réessayez plus tard');
    expect(handleUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  describe('after too many attempts', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('locks the login, remembers the end time and gives the remaining minutes', async () => {
      vi.mocked(apiFetch.post).mockRejectedValue(tooManyAttempts(842));
      const { result } = renderHook(() => useAuth());

      await act(() => result.current.login(credentials));

      expect(result.current.isLocked).toBe(true);
      expect(result.current.lockedMinutes).toBe(15);
      expect(result.current.error).toBeUndefined();
      expect(Number(localStorage.getItem(LOCK_KEY))).toBeGreaterThan(Date.now());
    });

    it('does not call the API while locked', async () => {
      vi.mocked(apiFetch.post).mockRejectedValue(tooManyAttempts(600));
      const { result } = renderHook(() => useAuth());
      await act(() => result.current.login(credentials));

      await act(() => result.current.login(credentials));

      expect(apiFetch.post).toHaveBeenCalledOnce();
    });

    it('restores the lock with an updated number of minutes after a reload', () => {
      localStorage.setItem(LOCK_KEY, String(Date.now() + 4 * 60 * 1000 + 5000));

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLocked).toBe(true);
      expect(result.current.lockedMinutes).toBe(5);
    });

    it('ignores a lock that has already ended', () => {
      localStorage.setItem(LOCK_KEY, String(Date.now() - 1000));

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLocked).toBe(false);
    });

    it('unlocks by itself at the end time', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      vi.mocked(apiFetch.post).mockRejectedValue(tooManyAttempts(60));
      const { result } = renderHook(() => useAuth());
      await act(() => result.current.login(credentials));

      await act(() => vi.advanceTimersByTimeAsync(61 * 1000));

      expect(result.current.isLocked).toBe(false);
      expect(localStorage.getItem(LOCK_KEY)).toBeNull();
    });
  });

  describe('register', () => {
    const registration = {
      displayName: 'Maître Ying',
      email: 'mj@example.com',
      password: 'Archipel-du-n3ant',
    };

    it('gives French field errors and does not call the API when the form is invalid', async () => {
      const { result } = renderHook(() => useAuth());

      await act(() =>
        result.current.register({
          displayName: 'Y',
          email: 'ying',
          password: 'court',
          passwordConfirmation: 'autre',
        }),
      );

      expect(result.current.fieldErrors).toEqual({
        displayName: 'Le pseudonyme doit contenir entre 2 et 50 caractères',
        email: 'Adresse e-mail invalide',
        password: 'Le mot de passe ne respecte pas toutes les règles',
        passwordConfirmation: 'Les mots de passe ne correspondent pas',
      });
      expect(apiFetch.post).not.toHaveBeenCalled();
    });

    it('refuses a confirmation that does not match a valid password', async () => {
      const { result } = renderHook(() => useAuth());

      await act(() =>
        result.current.register({ ...registerValues, passwordConfirmation: 'Archipel-du-n3ont' }),
      );

      expect(result.current.fieldErrors).toEqual({
        passwordConfirmation: 'Les mots de passe ne correspondent pas',
      });
      expect(apiFetch.post).not.toHaveBeenCalled();
    });

    it('clears the mismatch when the password changes', async () => {
      const { result } = renderHook(() => useAuth());

      await act(() =>
        result.current.register({ ...registerValues, passwordConfirmation: 'Archipel-du-n3ont' }),
      );
      act(() => result.current.clearFieldError('password'));

      expect(result.current.fieldErrors.passwordConfirmation).toBeUndefined();
    });

    it('keeps the same field errors when the changed field has none', async () => {
      const { result } = renderHook(() => useAuth());

      await act(() => result.current.register({ ...registerValues, displayName: 'Y' }));
      const fieldErrors = result.current.fieldErrors;
      act(() => result.current.clearFieldError('email'));

      expect(result.current.fieldErrors).toBe(fieldErrors);
    });

    it('stores the new user and goes to the dashboard', async () => {
      vi.mocked(apiFetch.post).mockResolvedValue(user);
      const { result } = renderHook(() => useAuth());

      await act(() => result.current.register(registerValues));

      expect(apiFetch.post).toHaveBeenCalledWith('/auth/register', registration);
      expect(result.current.fieldErrors).toEqual({});
      expect(handleUser).toHaveBeenCalledWith(user);
      expect(push).toHaveBeenCalledWith('/dashboard/campaigns');
      expect(refresh).toHaveBeenCalled();
    });

    it.each([
      [409, 'Un compte existe déjà avec cet e-mail'],
      [429, "Trop de tentatives d'inscription, réessayez plus tard"],
      [500, 'Une erreur est survenue, réessayez plus tard'],
    ])('shows a French message on a %i response', async (status, message) => {
      vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(status, null, '/auth/register'));
      const { result } = renderHook(() => useAuth());

      await act(() => result.current.register(registerValues));

      expect(result.current.error).toBe(message);
      expect(handleUser).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });
  });
});
