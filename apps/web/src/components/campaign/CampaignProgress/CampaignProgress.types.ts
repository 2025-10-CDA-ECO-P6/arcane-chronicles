import type { CampaignSummary } from '@arcane-chronicles/shared';
import type { TagColor } from '@/components/lib/ui/Tag/Tag.types';

export interface CampaignProgressProps {
  campaign: CampaignSummary;
  color: TagColor;
}
