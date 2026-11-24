import type { CampaignStatus } from '@arcane-chronicles/shared';
import type { TagColor } from '@/components/lib/ui/Tag/Tag.types';

export const CAMPAIGN_STATUS_DISPLAY: Record<CampaignStatus, { label: string; color: TagColor }> = {
  NEW: { label: 'À jouer', color: 'secondary' },
  IN_PROGRESS: { label: 'En cours', color: 'primary' },
  COMPLETED: { label: 'Terminée', color: 'gold' },
};
