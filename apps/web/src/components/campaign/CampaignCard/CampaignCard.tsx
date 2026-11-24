import Image from 'next/image';
import Link from 'next/link';

import type { CampaignCardProps } from './CampaignCard.types';

import { CampaignCounts } from '@/components/campaign/CampaignCounts/CampaignCounts';
import { CampaignProgress } from '@/components/campaign/CampaignProgress/CampaignProgress';
import { Tag } from '@/components/lib/ui/Tag/Tag';

import { CAMPAIGN_STATUS_DISPLAY } from '@/components/campaign/campaignStatus';
import { formatDate } from '@/lib/format';
import campaignDefaultImage from '@/assets/images/background-campagne-desktop.webp';
import styles from './CampaignCard.module.scss';

export function CampaignCard({ campaign }: CampaignCardProps) {
  const status = CAMPAIGN_STATUS_DISPLAY[campaign.status];
  const isInProgress = campaign.status === 'IN_PROGRESS';
  const classes = [
    styles.campaign_card,
    styles[`campaign_card--${status.color}`],
    isInProgress && styles['campaign_card--in-progress'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={classes}>
      <Link href={`/dashboard/campaigns/${campaign.id}`} className={styles.campaign_card__link}>
        <div className={styles.campaign_card__header}>
          <Image
            className={styles.campaign_card__header__image}
            src={campaign.imageUrl || campaignDefaultImage}
            alt={campaign.title}
            width={400}
            height={200}
          />
          <Tag
            className={styles.campaign_card__header__status}
            text={status.label}
            color={status.color}
            dot
          />
          <div className={styles.campaign_card__header__info}>
            <h2>{campaign.title}</h2>
            <small>
              <span>Créé le </span>
              <time dateTime={campaign.createdAt}>{formatDate(campaign.createdAt)}</time>
            </small>
          </div>
        </div>
        <div className={styles.campaign_card__content}>
          <CampaignCounts counts={campaign.counts} />
          <p>{campaign.description}</p>
          {isInProgress && <CampaignProgress campaign={campaign} color={status.color} />}
        </div>
      </Link>
    </li>
  );
}
