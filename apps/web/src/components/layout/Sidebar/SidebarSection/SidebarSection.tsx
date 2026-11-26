import type { SidebarSectionProps } from './SidebarSection.types';

import styles from './SidebarSection.module.scss';

export function SidebarSection({ id, title, children }: SidebarSectionProps) {
  return (
    <section className={styles['sidebar-section']} aria-labelledby={id}>
      <h2 id={id} className={styles['sidebar-section__title']}>
        {title}
      </h2>
      {children}
    </section>
  );
}
