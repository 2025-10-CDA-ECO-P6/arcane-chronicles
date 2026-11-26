import { cache } from 'react';

import type { CampaignDetail, CampaignSummary } from '@arcane-chronicles/shared';

import { ApiError } from '@/lib/api';
import { serverGet } from '@/lib/serverApi';

export const getMyCampaigns = cache(() => serverGet<CampaignSummary[]>('/campaigns?scope=mine'));

const sessionTime = (campaign: CampaignSummary) =>
  campaign.lastSessionAt ? Date.parse(campaign.lastSessionAt) : -Infinity;

export const getCampaignsToResume = (campaigns: CampaignSummary[]) =>
  campaigns
    .filter((campaign) => campaign.status === 'IN_PROGRESS')
    .sort((a, b) => sessionTime(b) - sessionTime(a));

export const getCampaign = async (id: string): Promise<CampaignDetail | null> => {
  try {
    return await serverGet<CampaignDetail>(`/campaigns/${encodeURIComponent(id)}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 422)) {
      return null;
    }
    throw error;
  }
};
