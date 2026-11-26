import type { CampaignSummary } from '@arcane-chronicles/shared';
import type { AuthUser } from '@/types/auth';

export interface SidebarProps {
  user: AuthUser;
  campaigns: CampaignSummary[];
}
