import type { ButtonProps } from './Button.types';

export function Button({
  color,
  filled,
  size,
  icon,
  iconOnly,
  round,
  buttonType = 'button',
  buttonText,
  className,
  disabled,
  handleClick,
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${color}`,
    filled && 'btn--filled',
    size === 'md' && 'btn--md',
    icon && `icon--${icon}`,
    iconOnly && 'btn--icon-only',
    round && 'btn--round',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={buttonType} className={classes} disabled={disabled} onClick={handleClick}>
      <span className={iconOnly ? 'sr-only' : undefined}>{buttonText}</span>
    </button>
  );
}
