import { AuthBanner } from '@/components/auth/AuthBanner/AuthBanner';
import { BackgroundVideo } from '@/components/lib/BackgroundVideo/BackgroundVideo';

import styles from './layout.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.background} aria-hidden="true">
        <BackgroundVideo className={styles.video} />
      </div>
      <div className={styles.auth}>
        <AuthBanner className={styles.auth__banner} />
        <section className={styles.auth__content}>{children}</section>
      </div>
    </div>
  );
}
