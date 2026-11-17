import { LogoutButton } from '@/components/auth/LogoutButton/LogoutButton';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <section>
      <h1>Arcane Chronicles</h1>
      <p>Préparez vos campagnes, pilotez vos parties.</p>
      {user && (
        <>
          <p>Connecté en tant que {user.displayName}.</p>
          <LogoutButton />
        </>
      )}
    </section>
  );
}
