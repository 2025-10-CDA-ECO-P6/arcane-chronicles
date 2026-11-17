import { BackgroundVideo } from '@/components/lib/BackgroundVideo/BackgroundVideo';

import styles from './layout.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.background} aria-hidden="true">
        <BackgroundVideo className={styles.video} />
      </div>
      {children}
    </div>
  );
}
