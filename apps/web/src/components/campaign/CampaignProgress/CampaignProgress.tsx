import type { ChapterStatus } from '@arcane-chronicles/shared';
import type { SegmentStatus } from '@/components/lib/ui/progress-bar/SegmentedProgress/SegmentedProgress.types';
import type { CampaignProgressProps } from './CampaignProgress.types';

import { ProgressRing } from '@/components/lib/ui/progress-bar/ProgressRing/ProgressRing';
import { SegmentedProgress } from '@/components/lib/ui/progress-bar/SegmentedProgress/SegmentedProgress';

import styles from './CampaignProgress.module.scss';

const CHAPTER_SEGMENT: Record<ChapterStatus, SegmentStatus> = {
  COMPLETED: 'done',
  IN_PROGRESS: 'current',
  NEW: 'todo',
};

export function CampaignProgress({ campaign, color }: CampaignProgressProps) {
  const { chapterStatuses, currentChapter } = campaign;
  const completedChapters = chapterStatuses.filter((chapter) => chapter === 'COMPLETED').length;

  return (
    <div className={styles['campaign-progress']}>
      <ProgressRing
        value={campaign.progress}
        label="Progression de la campagne"
        color={color}
        background="secondary"
      />
      <div className={styles['campaign-progress__chapter']}>
        <h3 className={styles['campaign-progress__heading']}>Progression</h3>
        <p className={styles['campaign-progress__name']}>Chapitre {currentChapter?.position}</p>
        <p className={styles['campaign-progress__name']}>{currentChapter?.title}</p>
        <SegmentedProgress
          segments={chapterStatuses.map((chapter) => CHAPTER_SEGMENT[chapter])}
          currentProgress={currentChapter?.progress}
          label="Chapitres de la campagne"
          valueText={`${completedChapters} chapitres terminés sur ${chapterStatuses.length}, chapitre en cours à ${currentChapter?.progress ?? 0} %`}
          color={color}
        />
      </div>
    </div>
  );
}
