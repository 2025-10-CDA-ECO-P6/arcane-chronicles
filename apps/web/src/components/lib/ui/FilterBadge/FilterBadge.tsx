import Link from 'next/link';

import type { FilterBadgeProps } from './FilterBadge.types';

import styles from './FilterBadge.module.scss';

export function FilterBadge({ label, href, count, isActive = false, className }: FilterBadgeProps) {
  const classes = [styles['filter-badge'], isActive && styles['filter-badge--active'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      href={href}
      scroll={false}
      className={classes}
      aria-current={isActive ? 'true' : undefined}
    >
      {label}
      {count !== undefined && (
        <>
          {' '}
          <span className={styles['filter-badge__count']}>{count}</span>
        </>
      )}
    </Link>
  );
}
