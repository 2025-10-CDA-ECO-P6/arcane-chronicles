'use client';

import { useParams, usePathname } from 'next/navigation';

import type { PageBodyProps } from './PageBody.types';

import { getPageClassName } from '@/lib/pageClassName';

export function PageBody({ children }: PageBodyProps) {
  return <body className={getPageClassName(usePathname(), useParams())}>{children}</body>;
}
