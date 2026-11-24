import type { CSSProperties } from 'react';
import type { SegmentedProgressProps } from './SegmentedProgress.types';

import styles from './SegmentedProgress.module.scss';

export function SegmentedProgress({
  segments,
  currentProgress = 0,
  label,
  valueText,
  color = 'primary',
  className,
}: SegmentedProgressProps) {
  const doneCount = segments.filter((segment) => segment === 'done').length;
  const classes = [styles['segmented-progress'], styles[`segmented-progress--${color}`], className]
    .filter(Boolean)
    .join(' ');
  const progressStyle = {
    '--current-progress': `${Math.min(Math.max(currentProgress, 0), 100)}%`,
  } as CSSProperties;

  return (
    <div
      className={classes}
      style={progressStyle}
      role="progressbar"
      aria-label={label}
      aria-valuenow={doneCount}
      aria-valuemin={0}
      aria-valuemax={segments.length}
      aria-valuetext={valueText}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          className={`${styles['segmented-progress__segment']} ${styles[`segmented-progress__segment--${segment}`]}`}
        />
      ))}
    </div>
  );
}
