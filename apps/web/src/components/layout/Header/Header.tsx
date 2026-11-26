'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { MainNav } from '@/components/layout/MainNav/MainNav';
import { Button } from '@/components/lib/Button/Button';

import { useArcane } from '@/context/ArcaneContext';
import logo from '@/assets/images/logo-emblem.webp';
import styles from './Header.module.scss';

const SCROLLED_OFFSET = 32;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { isSidebarOpen, toggleSidebar } = useArcane();
  const isGmSpace = usePathname().startsWith('/dashboard');

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let headerHeight = header.offsetHeight;
    const publishHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };
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
      publishHeight();
      updateScrolled();
    });

    publishHeight();
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
        {isGmSpace && (
          <Button
            color="primary"
            icon="menu-open"
            buttonText={isSidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            iconOnly
            transparent
            className={styles.header__content__menu}
            expanded={isSidebarOpen}
            controls="gm-sidebar"
            handleClick={toggleSidebar}
          />
        )}
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
