import { CAMPAIGN_STATUSES } from '@arcane-chronicles/shared';

import type { Metadata } from 'next';
import type { SearchParams } from '@/lib/searchParams';

import { PageHeader } from '@/components/lib/PageHeader/PageHeader';
import { CampaignCard } from '@/components/campaign/CampaignCard/CampaignCard';
import { FilterToolbar } from '@/components/lib/toolbar/FilterToolbar/FilterToolbar';
import { SearchBar } from '@/components/lib/ui/SearchBar/SearchBar';

import { CAMPAIGN_STATUS_DISPLAY } from '@/components/campaign/campaignStatus';
import { requireCurrentUser } from '@/lib/auth';
import { getMyCampaigns } from '@/lib/campaigns';
import { matchesSearch } from '@/lib/search';
import { getParam } from '@/lib/searchParams';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Tableau de bord | Arcane Chronicles',
};

const PAGE_PATH = '/dashboard/campaigns';

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireCurrentUser(PAGE_PATH);
  const params = await searchParams;
  const status = CAMPAIGN_STATUSES.find((value) => value === getParam(params, 'status'));
  const search = getParam(params, 'search')?.trim();

  const campaigns = await getMyCampaigns();
  const searched = campaigns.filter(
    (campaign) => !search || matchesSearch([campaign.title, campaign.description], search),
  );
  const filtered = searched.filter((campaign) => !status || campaign.status === status);
  const statusOptions = CAMPAIGN_STATUSES.map((value) => ({
    value,
    label: CAMPAIGN_STATUS_DISPLAY[value].label,
    count: searched.filter((campaign) => campaign.status === value).length,
  }));
  const inProgress = filtered.filter((campaign) => campaign.status === 'IN_PROGRESS');
  const others = filtered.filter((campaign) => campaign.status !== 'IN_PROGRESS');

  return (
    <>
      <PageHeader title="Mes campagnes">
        <FilterToolbar
          label="Filtrer les campagnes par statut"
          name="status"
          options={statusOptions}
          allCount={searched.length}
          pathname={PAGE_PATH}
          params={params}
        >
          <SearchBar
            label="Rechercher une campagne"
            name="search"
            pathname={PAGE_PATH}
            params={params}
            placeholder="Rechercher une campagne"
          />
        </FilterToolbar>
      </PageHeader>
      <div className={`main-content ${styles['campaign-page']}`}>
        {campaigns.length === 0 && <h2>Aucune campagne pour l’instant</h2>}
        {campaigns.length > 0 && filtered.length === 0 && (
          <h2>Aucune campagne ne correspond à ces critères</h2>
        )}
        {filtered.length > 0 && (
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
