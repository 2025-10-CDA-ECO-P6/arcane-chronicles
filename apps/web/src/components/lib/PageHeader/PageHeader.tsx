import type { CSSProperties } from 'react';
import type { PageHeaderProps } from './PageHeader.types';

import styles from './PageHeader.module.scss';

export function PageHeader({ title, image, actions, children, className }: PageHeaderProps) {
  const imageSrc = typeof image === 'string' ? image : image?.src;
  const imageStyle = imageSrc
    ? ({ '--page-header-image': `url(${JSON.stringify(imageSrc)})` } as CSSProperties)
    : undefined;

  return (
    <header
      className={className ? `${styles['page-header']} ${className}` : styles['page-header']}
      style={imageStyle}
    >
      <div className={styles['page-header__top']}>
        <h1 className={styles['page-header__title']}>{title}</h1>
        {actions && <div className={styles['page-header__actions']}>{actions}</div>}
      </div>
      {children}
    </header>
  );
}
