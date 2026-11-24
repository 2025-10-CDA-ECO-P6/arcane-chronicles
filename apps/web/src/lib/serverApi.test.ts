import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiFetch } from '@/lib/api';
import { getSessionToken, serverGet } from './serverApi';

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

describe('getSessionToken', () => {
  it('reads the session cookie of the request', async () => {
    mockCookie('abc');
    expect(await getSessionToken()).toBe('abc');

    mockCookie();
    expect(await getSessionToken()).toBeUndefined();
  });
});

describe('serverGet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the API without cache, forwarding the session cookie', async () => {
    mockCookie('abc');
    vi.mocked(apiFetch.get).mockResolvedValue({ id: '1' });

    expect(await serverGet('/campaigns/1')).toEqual({ id: '1' });
    expect(apiFetch.get).toHaveBeenCalledWith('/campaigns/1', {
      headers: { Cookie: 'token=abc' },
      cache: 'no-store',
    });
  });

  it('calls the API without a cookie header when there is no session cookie', async () => {
    mockCookie();
    vi.mocked(apiFetch.get).mockResolvedValue([]);

    await serverGet('/campaigns');

    expect(apiFetch.get).toHaveBeenCalledWith('/campaigns', {
      headers: undefined,
      cache: 'no-store',
    });
  });
});
