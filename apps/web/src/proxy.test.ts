import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { proxy } from './proxy';

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
const token = (expiresInSeconds: number) =>
  `${encode({ alg: 'HS256' })}.${encode({ id: '1', exp: Math.floor(Date.now() / 1000) + expiresInSeconds })}.signature`;

const request = (path: string, cookie?: string) =>
  new NextRequest(new URL(path, 'http://localhost:3000'), {
    headers: cookie ? { cookie: `token=${cookie}` } : {},
  });

const fetchMock = vi.fn();

describe('proxy', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a guest from a GM page to the login page with the page to come back to', async () => {
    const response = await proxy(request('/dashboard?tab=1'));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get('location') ?? '');
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('redirect')).toBe('/dashboard?tab=1');
  });

  it('treats an expired token as a guest', async () => {
    const response = await proxy(request('/dashboard', token(-60)));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/login');
  });

  it('lets a GM with an unexpired token reach a GM page', async () => {
    const response = await proxy(request('/dashboard', token(3600)));

    expect(response.headers.get('location')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a logged-in GM from the login page to the dashboard once the API accepts the session', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));

    const response = await proxy(request('/login', token(3600)));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/dashboard');
  });

  it('keeps the login page when the API rejects the token, so there is no redirect loop', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    const response = await proxy(request('/login', token(3600)));

    expect(response.headers.get('location')).toBeNull();
  });

  it('keeps the login page when the API cannot be reached', async () => {
    fetchMock.mockRejectedValue(new Error('down'));

    const response = await proxy(request('/register', token(3600)));

    expect(response.headers.get('location')).toBeNull();
  });

  it('ignores public pages', async () => {
    const response = await proxy(request('/'));

    expect(response.headers.get('location')).toBeNull();
  });
});
