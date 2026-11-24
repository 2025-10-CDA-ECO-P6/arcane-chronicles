export type ProgressRingColor = 'primary' | 'secondary' | 'third' | 'gold' | 'hostile';

export interface ProgressRingProps {
  value: number;
  label: string;
  color?: ProgressRingColor;
  background?: 'primary' | 'secondary';
  className?: string;
}
