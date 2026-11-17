import Image from 'next/image';

import { MainNav } from '@/components/layout/MainNav/MainNav';
import { Button } from '@/components/lib/Button/Button';

import logo from '@/assets/images/logo-emblem.webp';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Button
          color="primary"
          icon="menu-open"
          buttonText="Ouvrir le menu"
          iconOnly
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
