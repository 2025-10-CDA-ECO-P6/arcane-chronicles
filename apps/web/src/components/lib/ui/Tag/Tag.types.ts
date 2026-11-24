export type TagColor = 'primary' | 'secondary' | 'third' | 'gold' | 'hostile';

export interface TagProps {
  text: string;
  dot?: boolean;
  color?: TagColor;
  className?: string;
}
