export type ProgressBarColor = 'primary' | 'secondary' | 'third' | 'gold' | 'hostile';

export interface ProgressBarProps {
  value: number;
  min?: number;
  max: number;
  label?: string;
  valueText?: string;
  color?: ProgressBarColor;
  completeColor?: ProgressBarColor;
  className?: string;
}
