import { AuthHeader } from '@/components/auth/AuthHeader/AuthHeader';
import { RegisterForm } from '@/components/forms/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <AuthHeader
        title="Créer un compte"
        redirectText="Vous avez déjà un compte ?"
        redirectLabel="Connexion"
        redirectHref="/login"
      />
      <RegisterForm />
    </>
  );
}
