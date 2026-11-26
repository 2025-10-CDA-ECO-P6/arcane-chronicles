import type { ReactNode } from 'react';

import { Sidebar } from '@/components/layout/Sidebar/Sidebar/Sidebar';
import { SidebarShell } from '@/components/layout/Sidebar/SidebarShell/SidebarShell';

import { getCurrentUser } from '@/lib/auth';
import { getMyCampaigns } from '@/lib/campaigns';
import styles from './layout.module.scss';

export default async function GmLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const campaigns = user ? await getMyCampaigns() : [];

  return (
    <div className={styles['gm-layout']}>
      {user && (
        <SidebarShell>
          <Sidebar user={user} campaigns={campaigns} />
        </SidebarShell>
      )}
      <div className={styles['gm-layout__content']}>{children}</div>
    </div>
  );
}
