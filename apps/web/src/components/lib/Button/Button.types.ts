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
  buttonType?: ButtonType;
  buttonText: string;
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}
