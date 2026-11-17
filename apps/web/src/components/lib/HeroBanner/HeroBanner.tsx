import Image from 'next/image';

import { BackgroundVideo } from '@/components/lib/BackgroundVideo/BackgroundVideo';

import logo from '@/assets/images/logo-desktop.webp';
import styles from './HeroBanner.module.scss';

export function HeroBanner() {
  return (
    <div className={styles.banner}>
      <BackgroundVideo className={styles.banner__video} />
      <h1>
        <Image src={logo} alt="Arcane Chronicles" className={styles.banner__logo} preload />
      </h1>
    </div>
  );
}
