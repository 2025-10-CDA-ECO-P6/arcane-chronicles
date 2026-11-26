import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CampaignSummary } from '@arcane-chronicles/shared';

import { ApiError, apiFetch } from '@/lib/api';
import { getCampaign, getCampaignsToResume, getMyCampaigns } from './campaigns';

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

describe('getMyCampaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the campaigns of the GM, forwarding the session cookie', async () => {
    const campaigns = [{ id: '1', title: 'L’archipel du néant' }];
    mockCookie('abc');
    vi.mocked(apiFetch.get).mockResolvedValue(campaigns);

    expect(await getMyCampaigns()).toEqual(campaigns);
    expect(apiFetch.get).toHaveBeenCalledWith('/campaigns?scope=mine', {
      headers: { Cookie: 'token=abc' },
      cache: 'no-store',
    });
  });

  it('calls the API without a cookie header when there is no session cookie', async () => {
    mockCookie();
    vi.mocked(apiFetch.get).mockResolvedValue([]);

    await getMyCampaigns();

    expect(apiFetch.get).toHaveBeenCalledWith('/campaigns?scope=mine', {
      headers: undefined,
      cache: 'no-store',
    });
  });
});

describe('getCampaignsToResume', () => {
  const campaign = (id: string, status: CampaignSummary['status'], lastSessionAt: string | null) =>
    ({ id, status, lastSessionAt }) as CampaignSummary;

  const ids = (campaigns: CampaignSummary[]) => campaigns.map((item) => item.id);

  it('keeps only the campaigns in progress', () => {
    const campaigns = [
      campaign('new', 'NEW', null),
      campaign('playing', 'IN_PROGRESS', '2026-11-20T18:30:00.000Z'),
      campaign('done', 'COMPLETED', '2026-11-01T18:30:00.000Z'),
    ];

    expect(ids(getCampaignsToResume(campaigns))).toEqual(['playing']);
  });

  it('sorts them from the most recent session to the oldest', () => {
    const campaigns = [
      campaign('october', 'IN_PROGRESS', '2026-10-12T18:30:00.000Z'),
      campaign('november', 'IN_PROGRESS', '2026-11-20T18:30:00.000Z'),
      campaign('september', 'IN_PROGRESS', '2026-09-05T18:30:00.000Z'),
    ];

    expect(ids(getCampaignsToResume(campaigns))).toEqual(['november', 'october', 'september']);
  });

  it('puts a campaign without a session date last', () => {
    const campaigns = [
      campaign('no-date', 'IN_PROGRESS', null),
      campaign('october', 'IN_PROGRESS', '2026-10-12T18:30:00.000Z'),
    ];

    expect(ids(getCampaignsToResume(campaigns))).toEqual(['october', 'no-date']);
  });

  it('returns an empty list when there is nothing to resume', () => {
    expect(getCampaignsToResume([])).toEqual([]);
  });
});

describe('getCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookie('abc');
  });

  it('returns the campaign, forwarding the session cookie', async () => {
    const campaign = { id: 'campaign-1', title: 'L’archipel du néant' };
    vi.mocked(apiFetch.get).mockResolvedValue(campaign);

    expect(await getCampaign('campaign-1')).toEqual(campaign);
    expect(apiFetch.get).toHaveBeenCalledWith('/campaigns/campaign-1', {
      headers: { Cookie: 'token=abc' },
      cache: 'no-store',
    });
  });

  it('returns null when the campaign does not exist or the id is not valid', async () => {
    for (const status of [404, 422]) {
      vi.mocked(apiFetch.get).mockRejectedValue(new ApiError(status, null, '/campaigns/x'));

      expect(await getCampaign('x')).toBeNull();
    }
  });

  it('lets the other API errors through', async () => {
    vi.mocked(apiFetch.get).mockRejectedValue(new ApiError(500, null, '/campaigns/x'));

    await expect(getCampaign('x')).rejects.toThrow('API error 500');
  });
});
