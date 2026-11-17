import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

const fetchMock = vi.fn();
const clearedCookie =
  'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax';

const request = (path: string) => new NextRequest(new URL(path, 'http://localhost:3000'));

describe('GET /session-expired', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clears the cookie with the options sent by the API and goes back to the login page', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 200, headers: { 'Set-Cookie': clearedCookie } }),
    );

    const response = await GET(request('/session-expired?redirect=%2Fdashboard'));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/logout'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(response.headers.getSetCookie()).toContain(clearedCookie);
    const location = new URL(response.headers.get('location') ?? '');
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('redirect')).toBe('/dashboard');
  });

  it('still clears the cookie and goes to the login page when the API cannot be reached', async () => {
    fetchMock.mockRejectedValue(new Error('down'));

    const response = await GET(request('/session-expired'));

    expect(response.headers.getSetCookie().some((cookie) => cookie.startsWith('token=;'))).toBe(
      true,
    );
    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/login');
  });
});
