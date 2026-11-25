import type { FilterToolbarProps } from './FilterToolbar.types';

import { FilterSelect } from '@/components/lib/ui/FilterSelect/FilterSelect';
import { FilterBadge } from '@/components/lib/ui/FilterBadge/FilterBadge';

import { buildUrl, getParam } from '@/lib/searchParams';
import styles from './FilterToolbar.module.scss';

export function FilterToolbar({
  label,
  name,
  options,
  pathname,
  params,
  allLabel = 'Toutes',
  allCount,
  children,
  className,
}: FilterToolbarProps) {
  const classes = [styles['filter-toolbar'], className].filter(Boolean).join(' ');
  const activeValue = getParam(params, name);
  const isFiltered = options.some((option) => option.value === activeValue);

  return (
    <div className={classes}>
      <nav className={styles['filter-toolbar__badges']} aria-label={label}>
        <FilterBadge
          label={allLabel}
          count={allCount}
          href={buildUrl(pathname, params, { [name]: undefined })}
          isActive={!isFiltered}
        />
        {options.map((option) => (
          <FilterBadge
            key={option.value}
            label={option.label}
            count={option.count}
            href={buildUrl(pathname, params, { [name]: option.value })}
            isActive={option.value === activeValue}
          />
        ))}
      </nav>
      <FilterSelect
        label={label}
        name={name}
        options={options}
        pathname={pathname}
        params={params}
        allLabel={allLabel}
        allCount={allCount}
        className={styles['filter-toolbar__select']}
      />
      {children}
    </div>
  );
}
