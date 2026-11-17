import Image from 'next/image';

import { NavLink } from '@/components/lib/NavLink/NavLink';
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
        <h2 className={styles.header__content__title}>arcane chronicles</h2>
      </div>
      <div className={styles.header__nav_wrapper}>
        <nav className={styles.header__nav_wrapper__nav}>
          <NavLink className="link--text-secondary" href="/">
            Accueil
          </NavLink>
          <NavLink className="link--text-secondary" href="/login">
            Connexion
          </NavLink>
        </nav>
        <Image
          className={styles.header__nav_wrapper__logo}
          src={logo}
          alt="Arcane Chronicles Logo"
        />
      </div>
    </header>
  );
}
