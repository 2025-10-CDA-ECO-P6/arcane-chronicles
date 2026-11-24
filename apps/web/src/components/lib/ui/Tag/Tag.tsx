import type { TagProps } from './Tag.types';

import { Dot } from '../Dots/Dot';

import styles from './Tag.module.scss';

export function Tag({ text, color = 'primary', className, dot }: TagProps) {
  const classes = [styles.tag, styles[`tag--${color}`], className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <Dot color={color} />}
      {text}
    </span>
  );
}
