'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { SidebarLinkProps } from './SidebarLink.types';

import styles from './SidebarLink.module.scss';

export function SidebarLink({ href, icon, label, count }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const classes = [styles['sidebar-link'], isActive && styles['sidebar-link--active']]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={classes} aria-current={isActive ? 'page' : undefined}>
      <span className={`${styles['sidebar-link__icon']} icon--${icon}`} aria-hidden />
      <span className={styles['sidebar-link__label']}>{label}</span>
      {count !== undefined && <span className={styles['sidebar-link__count']}>{count}</span>}
    </Link>
  );
}
