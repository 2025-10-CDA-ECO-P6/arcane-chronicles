import { AuthHeader } from '@/components/auth/AuthHeader/AuthHeader';
import { LoginForm } from '@/components/forms/LoginForm/LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <>
      <AuthHeader
        title="Se connecter"
        redirectText="Vous n'avez pas encore de compte ?"
        redirectLabel="Inscription"
        redirectHref="/register"
      />
      <LoginForm redirectTo={typeof redirect === 'string' ? redirect : undefined} />
    </>
  );
}
