import Link from 'next/link';

import styles from './AuthHeader.module.scss';
import type { AuthHeaderProps } from './AuthHeader.types';

export function AuthHeader({
  title,
  redirectText,
  redirectLabel,
  redirectHref,
  className,
}: AuthHeaderProps) {
  return (
    <header className={className ? `${styles.header} ${className}` : styles.header}>
      <h1 className={styles.header__title}>{title}</h1>
      <p className={styles.header__redirect}>
        {`${redirectText} `}
        <Link className="link link--secondary" href={redirectHref}>
          {redirectLabel}
        </Link>
      </p>
    </header>
  );
}
