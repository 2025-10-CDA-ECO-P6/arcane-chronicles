import styles from './Dot.module.scss';
import type { DotProps } from './Dot.types';

export function Dot({ color = 'primary', className }: DotProps) {
  const classes = [styles.dot, styles[color], className].filter(Boolean).join(' ');

  return <span className={classes} aria-hidden="true" />;
}
