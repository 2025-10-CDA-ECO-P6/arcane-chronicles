import { describe, expect, it } from 'vitest';

import { buildUrl, getOtherParams, getParam } from './searchParams';

describe('getParam', () => {
  it('returns the value of a single parameter', () => {
    expect(getParam({ status: 'NEW' }, 'status')).toBe('NEW');
  });

  it('ignores a missing or repeated parameter', () => {
    expect(getParam({}, 'status')).toBeUndefined();
    expect(getParam({ status: ['NEW', 'COMPLETED'] }, 'status')).toBeUndefined();
  });
});

describe('getOtherParams', () => {
  it('keeps the single parameters other than the named one', () => {
    expect(
      getOtherParams(
        { search: 'dragon', status: 'NEW', tag: ['a', 'b'], empty: undefined },
        'search',
      ),
    ).toEqual([['status', 'NEW']]);
  });
});

describe('buildUrl', () => {
  it('adds a parameter to the address', () => {
    expect(buildUrl('/dashboard/campaigns', {}, { status: 'NEW' })).toBe(
      '/dashboard/campaigns?status=NEW',
    );
  });

  it('keeps the other parameters and replaces the changed one', () => {
    expect(
      buildUrl(
        '/dashboard/campaigns',
        { search: 'dragon', status: 'NEW' },
        { status: 'COMPLETED' },
      ),
    ).toBe('/dashboard/campaigns?search=dragon&status=COMPLETED');
  });

  it('removes a parameter set to undefined or empty', () => {
    expect(buildUrl('/dashboard/campaigns', { status: 'NEW' }, { status: undefined })).toBe(
      '/dashboard/campaigns',
    );
    expect(
      buildUrl('/dashboard/campaigns', { search: 'dragon', status: 'NEW' }, { search: '' }),
    ).toBe('/dashboard/campaigns?status=NEW');
  });

  it('encodes the values', () => {
    expect(buildUrl('/dashboard/campaigns', {}, { search: 'l’île & co' })).toBe(
      '/dashboard/campaigns?search=l%E2%80%99%C3%AEle+%26+co',
    );
  });
});
