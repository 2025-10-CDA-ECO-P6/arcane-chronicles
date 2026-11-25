import type { TagColor } from '@/components/lib/ui/Tag/Tag.types';

export interface CampaignProgressBarProps {
  progress: number;
  color: TagColor;
  className?: string;
}
