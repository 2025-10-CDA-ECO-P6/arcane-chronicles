import type { ReactNode } from 'react';

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
}
