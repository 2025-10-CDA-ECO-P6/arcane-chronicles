import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiFetch } from '@/lib/api';

import { getCurrentUser } from './auth';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
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
