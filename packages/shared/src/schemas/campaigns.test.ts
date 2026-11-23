import { describe, expect, it } from 'vitest';

import { campaignListQuerySchema } from './campaigns.js';

describe('campaignListQuerySchema', () => {
  it('lists the public campaigns when no scope is given', () => {
    expect(campaignListQuerySchema.parse({})).toEqual({ scope: 'public' });
  });

  it('accepts the public and mine scopes', () => {
    expect(campaignListQuerySchema.parse({ scope: 'public' })).toEqual({ scope: 'public' });
    expect(campaignListQuerySchema.parse({ scope: 'mine' })).toEqual({ scope: 'mine' });
  });

  it('refuses any other scope', () => {
    const result = campaignListQuerySchema.safeParse({ scope: 'all' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Scope must be public or mine');
  });
});
