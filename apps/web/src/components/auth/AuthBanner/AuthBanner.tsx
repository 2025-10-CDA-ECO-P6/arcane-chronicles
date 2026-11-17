import Image from 'next/image';

import logo from '@/assets/images/logo-desktop.webp';
import { Dot } from '@/components/lib/ui/Dots/Dot';

import styles from './AuthBanner.module.scss';
import type { AuthBannerProps } from './AuthBanner.types';

const FEATURES = [
  'Chapitres, scènes, quêtes',
  'Personnages, monstres et objets',
  'Pièges, coffres et énigmes',
];

export function AuthBanner({ className }: AuthBannerProps) {
  return (
    <section className={className ? `${styles.banner} ${className}` : styles.banner}>
      <Image className={styles.banner__logo} src={logo} alt="Arcane Chronicles" priority />
      <div className={styles.banner__content}>
        <h3 className={styles.banner__content__title}>Préparez vos campagnes en un seul lieu</h3>
        <ul className={styles.banner__content__list}>
          {FEATURES.map((feature) => (
            <li key={feature} className={styles.banner__content__list__item}>
              <Dot color="secondary" />
              <span className={styles.banner__content__list__item__text}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
