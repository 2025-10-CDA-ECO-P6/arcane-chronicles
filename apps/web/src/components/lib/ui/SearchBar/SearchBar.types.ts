import type { SearchParams } from '@/lib/searchParams';

export interface SearchBarProps {
  label: string;
  name: string;
  pathname: string;
  params: SearchParams;
  placeholder?: string;
  className?: string;
}
