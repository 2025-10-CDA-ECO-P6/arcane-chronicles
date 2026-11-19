import type { MouseEventHandler } from 'react';

export type ButtonColor = 'primary' | 'secondary' | 'hostile' | 'gold' | 'neutral';

export type ButtonSize = 'sm' | 'md';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  color: ButtonColor;
  filled?: boolean;
  size?: ButtonSize;
  icon?: string;
  iconOnly?: boolean;
  round?: boolean;
  transparent?: boolean;
  buttonType?: ButtonType;
  buttonText: string;
  className?: string;
  disabled?: boolean;
  expanded?: boolean;
  controls?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}
