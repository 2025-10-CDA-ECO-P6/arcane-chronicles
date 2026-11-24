import type { Metadata } from 'next';

import { Button } from '@/components/lib/Button/Button';
import { PageHeader } from '@/components/lib/PageHeader/PageHeader';
import { CampaignCard } from '@/components/campaign/CampaignCard/CampaignCard';

import { requireCurrentUser } from '@/lib/auth';
import { getMyCampaigns } from '@/lib/campaigns';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Tableau de bord | Arcane Chronicles',
};

export default async function DashboardPage() {
  await requireCurrentUser('/dashboard/campaigns');
  const campaigns = await getMyCampaigns();
  const inProgress = campaigns.filter((campaign) => campaign.status === 'IN_PROGRESS');
  const others = campaigns.filter((campaign) => campaign.status !== 'IN_PROGRESS');

  return (
    <>
      <PageHeader
        title="Mes campagnes"
        actions={
          <Button color="primary" filled icon="plus" buttonText="Nouvelle campagne" size="md" />
        }
      />
      <div className="main-content">
        {campaigns.length === 0 ? (
          <h2>Aucune campagne pour l’instant</h2>
        ) : (
          <ul className={styles['campaign-list']}>
            {[...inProgress, ...others].map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
