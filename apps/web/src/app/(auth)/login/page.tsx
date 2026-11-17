import { AuthBanner } from '@/components/auth/AuthBanner/AuthBanner';
import { AuthHeader } from '@/components/auth/AuthHeader/AuthHeader';
import { LoginForm } from '@/components/forms/LoginForm/LoginForm';

import styles from './page.module.scss';

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <div className={styles.auth}>
      <AuthBanner className={styles.auth__banner} />
      <section className={styles.auth__content}>
        <AuthHeader
          title="Se connecter"
          redirectText="Vous n'avez pas encore de compte ?"
          redirectLabel="Inscription"
          redirectHref="/register"
        />
        <LoginForm redirectTo={typeof redirect === 'string' ? redirect : undefined} />
      </section>
    </div>
  );
}
