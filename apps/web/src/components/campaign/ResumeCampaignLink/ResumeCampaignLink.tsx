import Image from 'next/image';
import Link from 'next/link';

import type { ResumeCampaignLinkProps } from './ResumeCampaignLink.types';

import { ProgressBar } from '@/components/lib/ui/progress-bar/ProgressBar/ProgressBar';

import campaignDefaultImage from '@/assets/images/background-campagne-mobile.webp';
import styles from './ResumeCampaignLink.module.scss';

export function ResumeCampaignLink({ campaign }: ResumeCampaignLinkProps) {
  const { currentChapter } = campaign;

  return (
    <Link href={`/dashboard/campaigns/${campaign.id}`} className={styles['resume-campaign']}>
      <Image
        className={styles['resume-campaign__image']}
        src={campaign.imageUrl || campaignDefaultImage}
        alt=""
        width={48}
        height={48}
      />
      <span className={styles['resume-campaign__info']}>
        <span className={styles['resume-campaign__title']}>{campaign.title}</span>
        {currentChapter && (
          <span className={styles['resume-campaign__progress']}>
            Chapitre {currentChapter.position} - {currentChapter.progress}%
          </span>
        )}
        <ProgressBar value={campaign.progress} max={100} />
      </span>
      <span className={`${styles['resume-campaign__chevron']} icon--chevron-right`} aria-hidden />
    </Link>
  );
}
