'use client';

import type { SidebarShellProps } from './SidebarShell.types';

import { useArcane } from '@/context/ArcaneContext';
import styles from './SidebarShell.module.scss';

export function SidebarShell({ children }: SidebarShellProps) {
  const { isSidebarOpen } = useArcane();
  const classes = [styles.sidebar, !isSidebarOpen && styles['sidebar--closed']]
    .filter(Boolean)
    .join(' ');

  return (
    <aside id="gm-sidebar" className={classes} aria-label="Menu de l’espace MJ">
      <div className={styles.sidebar__panel}>{children}</div>
    </aside>
  );
}
