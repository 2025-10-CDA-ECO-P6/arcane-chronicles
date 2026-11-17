export type DotColor = 'primary' | 'secondary' | 'third' | 'gold' | 'hostile';

export interface DotProps {
  color?: DotColor;
  className?: string;
}
