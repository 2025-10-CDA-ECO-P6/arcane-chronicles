import Link from 'next/link';

import type { SidebarProps } from './Sidebar.types';

import { ResumeCampaignLink } from '@/components/campaign/ResumeCampaignLink/ResumeCampaignLink';
import { SidebarLink } from '@/components/layout/Sidebar/SidebarLink/SidebarLink';
import { SidebarProfile } from '@/components/layout/Sidebar/SidebarProfile/SidebarProfile';
import { SidebarSection } from '@/components/layout/Sidebar/SidebarSection/SidebarSection';

import { getCampaignsToResume } from '@/lib/campaigns';
import styles from './Sidebar.module.scss';

const RESUME_LIMIT = 3;

export function Sidebar({ user, campaigns }: SidebarProps) {
  const toResume = getCampaignsToResume(campaigns);

  return (
    <div className={styles.sidebar}>
      <SidebarProfile
        user={user}
        campaignCount={campaigns.length}
        inProgressCount={toResume.length}
      />

      <SidebarSection id="sidebar-resume" title="Reprendre">
        {toResume.length === 0 ? (
          <p className={styles.sidebar__empty}>Aucune campagne en cours</p>
        ) : (
          <ul className={styles.sidebar__list}>
            {toResume.slice(0, RESUME_LIMIT).map((campaign) => (
              <li key={campaign.id}>
                <ResumeCampaignLink campaign={campaign} />
              </li>
            ))}
          </ul>
        )}
        {toResume.length > RESUME_LIMIT && (
          <Link
            href="/dashboard/campaigns?status=IN_PROGRESS"
            className={`link ${styles.sidebar__more}`}
          >
            Voir plus
          </Link>
        )}
      </SidebarSection>

      <SidebarSection id="sidebar-workshop" title="Mon atelier">
        <nav aria-labelledby="sidebar-workshop">
          <SidebarLink
            href="/dashboard/campaigns"
            icon="spiked-dragon-head"
            label="Campagnes"
            count={campaigns.length}
          />
        </nav>
      </SidebarSection>
    </div>
  );
}
