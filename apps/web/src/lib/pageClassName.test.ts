import { describe, expect, it } from 'vitest';

import { getPageClassName } from './pageClassName';

describe('getPageClassName', () => {
  it('names the home page home-index', () => {
    expect(getPageClassName('/')).toBe('home-index');
  });

  it('adds -index to the page path', () => {
    expect(getPageClassName('/login')).toBe('login-index');
  });

  it('joins nested segments with a dash and ignores a trailing slash', () => {
    expect(getPageClassName('/dashboard/campaigns/')).toBe('dashboard-campaigns-index');
  });

  it('replaces an identifier with details, whatever its format', () => {
    const id = '0b7a7d1e-2f8c-4c55-9a39-3c1f5e1b9d42';

    expect(getPageClassName(`/campaigns/${id}`, { id })).toBe('campaigns-details-index');
    expect(getPageClassName('/campaigns/archipel-du-neant', { slug: 'archipel-du-neant' })).toBe(
      'campaigns-details-index',
    );
  });

  it('replaces every identifier of a nested route', () => {
    expect(
      getPageClassName('/campaigns/42/chapters/7/edit', { campaignId: '42', chapterId: '7' }),
    ).toBe('campaigns-details-chapters-details-edit-index');
  });

  it('recognises an encoded identifier and every part of a catch-all route', () => {
    expect(getPageClassName('/campaigns/n%C3%A9ant', { slug: 'néant' })).toBe(
      'campaigns-details-index',
    );
    expect(getPageClassName('/docs/rules/combat', { path: ['rules', 'combat'] })).toBe(
      'docs-details-details-index',
    );
  });
});
