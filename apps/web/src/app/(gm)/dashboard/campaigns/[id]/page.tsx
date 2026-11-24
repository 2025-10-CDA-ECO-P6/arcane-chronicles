import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/lib/PageHeader/PageHeader';

import { requireCurrentUser } from '@/lib/auth';
import { getCampaign } from '@/lib/campaigns';
import campaignDefaultImage from '@/assets/images/background-campagne-desktop.webp';

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  await requireCurrentUser(`/dashboard/campaigns/${id}`);
  const campaign = await getCampaign(id);

  if (!campaign) {
    notFound();
  }

  return <PageHeader title={campaign.title} image={campaign.imageUrl ?? campaignDefaultImage} />;
}
