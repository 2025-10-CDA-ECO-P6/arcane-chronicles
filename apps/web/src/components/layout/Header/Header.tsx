'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { MainNav } from '@/components/layout/MainNav/MainNav';
import { Button } from '@/components/lib/Button/Button';

import logo from '@/assets/images/logo-emblem.webp';
import styles from './Header.module.scss';

const SCROLLED_OFFSET = 32;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let headerHeight = header.offsetHeight;
    const updateScrolled = () => {
      if (window.scrollY > headerHeight + SCROLLED_OFFSET) {
        setIsScrolled(true);
        setHasScrolled(true);
      } else if (window.scrollY === 0) {
        setIsScrolled(false);
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      headerHeight = header.offsetHeight;
      updateScrolled();
    });

    updateScrolled();
    resizeObserver.observe(header);
    window.addEventListener('scroll', updateScrolled, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updateScrolled);
    };
  }, []);

  const headerClassName = [
    styles.header,
    !hasScrolled && styles['header--intro'],
    isScrolled && styles['header--scrolled'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header ref={headerRef} className={headerClassName}>
      <div className={styles.header__content}>
        <Button
          color="primary"
          icon="menu-open"
          buttonText="Ouvrir le menu"
          iconOnly
          transparent
          className={styles.header__content__menu}
        />
        <p className={styles.header__content__title}>arcane chronicles</p>
      </div>
      <div className={styles.header__nav_wrapper}>
        <MainNav className={styles.header__nav_wrapper__nav} />
        <Image
          className={styles.header__nav_wrapper__logo}
          src={logo}
          alt="Arcane Chronicles Logo"
        />
      </div>
    </header>
  );
}
