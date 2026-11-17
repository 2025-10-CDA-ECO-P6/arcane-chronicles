import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
const user = { id: '1', displayName: 'Maître Ying', email: 'mj@example.com' };
const credentials = { email: 'mj@example.com', password: 'secret' };

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push, refresh } as unknown as ReturnType<
      typeof useRouter
    >);
    vi.mocked(useArcane).mockReturnValue({ currentUser: null, isLogged: false, handleUser });
  });

  it('stores the user and goes to the dashboard after a successful login', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials));

    expect(apiFetch.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(handleUser).toHaveBeenCalledWith(user);
    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(refresh).toHaveBeenCalled();
  });

  it('goes back to the requested page when it is a local path', async () => {
    vi.mocked(apiFetch.post).mockResolvedValue(user);
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials, '/campaigns/42?tab=quests'));

    expect(push).toHaveBeenCalledWith('/campaigns/42?tab=quests');
  });

  it.each(['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)'])(
    'refuses the unsafe redirect target %s',
    async (target) => {
      vi.mocked(apiFetch.post).mockResolvedValue(user);
      const { result } = renderHook(() => useAuth());

      await act(() => result.current.login(credentials, target));

      expect(push).toHaveBeenCalledWith('/dashboard');
    },
  );

  it.each([
    [401, 'Email ou mot de passe incorrect'],
    [429, 'Trop de tentatives de connexion, réessayez dans 15 minutes'],
    [500, 'Une erreur est survenue, réessayez plus tard'],
  ])('shows a French message on a %i response', async (status, message) => {
    vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(status, null, '/auth/login'));
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.login(credentials));

    expect(result.current.error).toBe(message);
    expect(result.current.isLoading).toBe(false);
    expect(handleUser).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('clears the error on demand', async () => {
    vi.mocked(apiFetch.post).mockRejectedValue(new ApiError(401, null, '/auth/login'));
    const { result } = renderHook(() => useAuth());
    await act(() => result.current.login(credentials));

    act(() => result.current.clearError());

    expect(result.current.error).toBeUndefined();
  });

  it('logs out and goes to the login page even when the API call fails', async () => {
    vi.mocked(apiFetch.post).mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useAuth());

    await act(() => result.current.logout().catch(() => undefined));

    expect(apiFetch.post).toHaveBeenCalledWith('/auth/logout');
    expect(handleUser).toHaveBeenCalledWith(null);
    expect(push).toHaveBeenCalledWith('/login');
  });
});
