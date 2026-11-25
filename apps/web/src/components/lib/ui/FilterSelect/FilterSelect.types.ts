import type { FilterOption } from '@/components/lib/toolbar/FilterToolbar/FilterToolbar.types';
import type { SearchParams } from '@/lib/searchParams';

export interface FilterSelectProps {
  label: string;
  name: string;
  options: FilterOption[];
  pathname: string;
  params: SearchParams;
  allLabel: string;
  allCount?: number;
  className?: string;
}
