export type ToggletipPlacement = 'top' | 'bottom';

export interface ToggletipProps {
  label: string;
  icon?: string;
  placement?: ToggletipPlacement;
  children: React.ReactNode;
  className?: string;
}
