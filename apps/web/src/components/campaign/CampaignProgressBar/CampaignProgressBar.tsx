import type { CampaignProgressBarProps } from './CampaignProgressBar.types';

import { ProgressBar } from '@/components/lib/ui/progress-bar/ProgressBar/ProgressBar';

import styles from './CampaignProgressBar.module.scss';

export function CampaignProgressBar({ progress, color, className }: CampaignProgressBarProps) {
  const classes = [styles['campaign-progress-bar'], className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className={styles['campaign-progress-bar__labels']} aria-hidden="true">
        <small className={styles['campaign-progress-bar__value']}>{progress}%</small>
        <small className={styles['campaign-progress-bar__label']}>Progression</small>
      </div>
      <ProgressBar
        value={progress}
        max={100}
        label="Progression de la campagne"
        valueText={`${progress} %`}
        color={color}
      />
    </div>
  );
}
