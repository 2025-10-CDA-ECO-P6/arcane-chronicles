import type { AuthUser } from '@/types/auth';

export interface SidebarProfileProps {
  user: AuthUser;
  campaignCount: number;
  inProgressCount: number;
}
