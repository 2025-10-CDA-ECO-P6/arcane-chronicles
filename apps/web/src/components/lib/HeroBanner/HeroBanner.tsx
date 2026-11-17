'use client';

import Image from 'next/image';

import logo from '@/assets/images/logo-desktop.webp';
import styles from './HeroBanner.module.scss';

export function HeroBanner() {
  return (
    <div className={styles.banner}>
      <video
        className={styles.banner__video}
        autoPlay
        muted
        loop
        playsInline
        poster="/videos/fire-poster.webp"
      >
        <source
          src="/videos/fire.mp4"
          type="video/mp4"
          media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
        />
      </video>
      <Image src={logo} alt="Hero Image" className={styles.banner__logo} />
    </div>
  );
}
