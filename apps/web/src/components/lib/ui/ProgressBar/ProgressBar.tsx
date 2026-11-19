import type { CSSProperties } from 'react';

import styles from './ProgressBar.module.scss';
import type { ProgressBarProps } from './ProgressBar.types';

export const getProgressPercentage = (value: number, min: number, max: number): number => {
  if (max <= min) {
    return 0;
  }

  return ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;
};

export function ProgressBar({
  value,
  min = 0,
  max,
  label,
  valueText,
  color = 'primary',
  completeColor,
  className,
}: ProgressBarProps) {
  const percentage = getProgressPercentage(value, min, max);
  const currentColor = percentage === 100 && completeColor ? completeColor : color;
  const classes = [styles.progress, styles[`progress--${currentColor}`], className]
    .filter(Boolean)
    .join(' ');
  const progressStyle = { '--progress-value': `${percentage}%` } as CSSProperties;

  if (!label) {
    return <div className={classes} style={progressStyle} aria-hidden="true" />;
  }

  return (
    <div
      className={classes}
      style={progressStyle}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
    />
  );
}
