'use client';

import { useRouter } from 'next/navigation';

import type { ChangeEvent } from 'react';
import type { FilterSelectProps } from './FilterSelect.types';

import { buildUrl, getParam } from '@/lib/searchParams';

const withCount = (label: string, count?: number) =>
  count === undefined ? label : `${label} (${count})`;

export function FilterSelect({
  label,
  name,
  options,
  pathname,
  params,
  allLabel,
  allCount,
  className,
}: FilterSelectProps) {
  const router = useRouter();
  const activeValue = getParam(params, name);
  const selectedValue = options.some((option) => option.value === activeValue) ? activeValue : '';

  const applyFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(pathname, params, { [name]: event.target.value }), { scroll: false });
  };

  return (
    <div className={className ? `form-select ${className}` : 'form-select'}>
      <select aria-label={label} value={selectedValue} onChange={applyFilter}>
        <option value="">{withCount(allLabel, allCount)}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {withCount(option.label, option.count)}
          </option>
        ))}
      </select>
    </div>
  );
}
