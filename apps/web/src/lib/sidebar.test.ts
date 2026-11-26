import { describe, expect, it } from 'vitest';

import { isSidebarOpenFromCookie, sidebarCookie } from './sidebar';

describe('isSidebarOpenFromCookie', () => {
  it('keeps the sidebar open unless the cookie says it was closed', () => {
    expect(isSidebarOpenFromCookie(undefined)).toBe(true);
    expect(isSidebarOpenFromCookie('open')).toBe(true);
    expect(isSidebarOpenFromCookie('closed')).toBe(false);
  });
});

describe('sidebarCookie', () => {
  it('stores the state for a year on the whole site', () => {
    expect(sidebarCookie(false)).toBe('sidebar=closed; path=/; max-age=31536000; samesite=lax');
    expect(sidebarCookie(true)).toMatch(/^sidebar=open;/);
  });
});
