import type { CSSProperties } from 'react';
import type { ProgressRingProps } from './ProgressRing.types';

import styles from './ProgressRing.module.scss';

export function ProgressRing({
  value,
  label,
  color = 'primary',
  background = 'primary',
  className,
}: ProgressRingProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const classes = [
    styles['progress-ring'],
    styles[`progress-ring--${color}`],
    styles[`progress-ring--on-${background}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const ringStyle = { '--progress-value': `${percentage}%` } as CSSProperties;

  return (
    <div
      className={classes}
      style={ringStyle}
      role="progressbar"
      aria-label={label}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {percentage}%
    </div>
  );
}
