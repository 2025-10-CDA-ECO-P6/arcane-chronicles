export type SegmentedProgressColor = 'primary' | 'secondary' | 'third' | 'gold' | 'hostile';

export type SegmentStatus = 'done' | 'current' | 'todo';

export interface SegmentedProgressProps {
  segments: SegmentStatus[];
  currentProgress?: number;
  label: string;
  valueText?: string;
  color?: SegmentedProgressColor;
  className?: string;
}
