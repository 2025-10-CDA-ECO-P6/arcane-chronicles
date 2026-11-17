import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiFetch } from '@/lib/api';

import { getCurrentUser, requireCurrentUser } from './auth';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));
vi.mock('@/lib/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/api')>()),
  apiFetch: { get: vi.fn() },
}));

const mockCookie = (token?: string) => {
  vi.mocked(cookies).mockResolvedValue({
    get: () => (token ? { name: 'token', value: token } : undefined),
  } as unknown as Awaited<ReturnType<typeof cookies>>);
};

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null without calling the API when there is no session cookie', async () => {
    mockCookie();

    expect(await getCurrentUser()).toBeNull();
    expect(apiFetch.get).not.toHaveBeenCalled();
  });

  it('returns the user sent by GET /auth/me, forwarding the cookie', async () => {
    const user = { id: '1', displayName: 'Maître Ying', email: 'mj@example.com' };
    mockCookie('abc');
    vi.mocked(apiFetch.get).mockResolvedValue(user);

    expect(await getCurrentUser()).toEqual(user);
    expect(apiFetch.get).toHaveBeenCalledWith('/auth/me', {
      headers: { Cookie: 'token=abc' },
      cache: 'no-store',
    });
  });

  it('returns null when the API rejects the session', async () => {
    mockCookie('expired');
    vi.mocked(apiFetch.get).mockRejectedValue(new ApiError(401, null, '/auth/me'));

    expect(await getCurrentUser()).toBeNull();
  });
});

describe('requireCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the user when the session is accepted', async () => {
    const user = { id: '1', displayName: 'Maître Ying', email: 'mj@example.com' };
    mockCookie('valid');
    vi.mocked(apiFetch.get).mockResolvedValue(user);

    expect(await requireCurrentUser('/dashboard')).toEqual(user);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects to the login page with the requested page when there is no session', async () => {
    mockCookie();

    await expect(requireCurrentUser('/campaigns/42?tab=quests')).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login?redirect=%2Fcampaigns%2F42%3Ftab%3Dquests');
  });
});
