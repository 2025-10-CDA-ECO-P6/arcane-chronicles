'use client';

import { type CSSProperties, useRef } from 'react';

import type { PageHeaderProps } from './PageHeader.types';

import { useStickyHeader } from '@/hooks/useStickyHeader';
import styles from './PageHeader.module.scss';

export function PageHeader({ title, image, actions, children, className }: PageHeaderProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const pageHeaderRef = useRef<HTMLElement>(null);
  const returnPointRef = useRef<HTMLDivElement>(null);
  const { isSticky, hasBeenSticky } = useStickyHeader(
    placeholderRef,
    pageHeaderRef,
    returnPointRef,
  );

  const imageSrc = typeof image === 'string' ? image : image?.src;
  const imageStyle = imageSrc
    ? ({ '--page-header-image': `url(${JSON.stringify(imageSrc)})` } as CSSProperties)
    : undefined;

  const headerClassName = [
    styles['page-header'],
    isSticky && styles['sticky-header'],
    !isSticky && hasBeenSticky && styles['page-header--returned'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={placeholderRef} className={styles['page-header-placeholder']}>
      {children && (
        <div
          ref={returnPointRef}
          className={styles['page-header-placeholder__return-point']}
          aria-hidden
        />
      )}
      <header ref={pageHeaderRef} className={headerClassName} style={imageStyle}>
        <div className={styles['page-header__top']}>
          <h1 className={styles['page-header__title']}>{title}</h1>
          {actions && <div className={styles['page-header__actions']}>{actions}</div>}
        </div>
        {children && <div className={styles['page-header__content']}>{children}</div>}
      </header>
    </div>
  );
}
