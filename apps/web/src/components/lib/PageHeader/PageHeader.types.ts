import type { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  image?: StaticImageData | string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}
