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
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a guest from a GM page to the login page with the page to come back to', () => {
    const response = proxy(request('/dashboard?tab=1'));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get('location') ?? '');
    expect(location.pathname).toBe('/login');
    expect(location.searchParams.get('redirect')).toBe('/dashboard?tab=1');
  });

  it('treats an expired token as a guest', () => {
    const response = proxy(request('/dashboard', token(-60)));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/login');
  });

  it('treats a malformed token as a guest', () => {
    const response = proxy(request('/dashboard', 'not-a-jwt'));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/login');
  });

  it('lets a GM with an unexpired token reach a GM page', () => {
    const response = proxy(request('/dashboard', token(3600)));

    expect(response.headers.get('location')).toBeNull();
  });

  it('sends a GM with an unexpired token from the login page to the dashboard without calling the API', () => {
    const response = proxy(request('/login', token(3600)));

    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/dashboard');
  });

  it('keeps a guest on the register page', () => {
    const response = proxy(request('/register'));

    expect(response.headers.get('location')).toBeNull();
  });

  it('ignores public pages', () => {
    const response = proxy(request('/'));

    expect(response.headers.get('location')).toBeNull();
  });
});
