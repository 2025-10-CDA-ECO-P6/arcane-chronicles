import type { CampaignDetail, CampaignSummary } from '@arcane-chronicles/shared';

import { ApiError } from '@/lib/api';
import { serverGet } from '@/lib/serverApi';

export const getMyCampaigns = () => serverGet<CampaignSummary[]>('/campaigns?scope=mine');

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
