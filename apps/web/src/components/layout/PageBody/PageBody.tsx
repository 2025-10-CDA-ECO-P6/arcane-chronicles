'use client';

import { useParams, usePathname } from 'next/navigation';

import { getPageClassName } from '@/lib/pageClassName';

import type { PageBodyProps } from './PageBody.types';

export function PageBody({ children }: PageBodyProps) {
  return <body className={getPageClassName(usePathname(), useParams())}>{children}</body>;
}
