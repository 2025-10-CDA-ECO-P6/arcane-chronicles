import type { ReactNode } from 'react';
import type { SearchParams } from '@/lib/searchParams';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterToolbarProps {
  label: string;
  name: string;
  options: FilterOption[];
  pathname: string;
  params: SearchParams;
  allLabel?: string;
  allCount?: number;
  children?: ReactNode;
  className?: string;
}
