import { LogoutButton } from '@/components/auth/LogoutButton/LogoutButton';
import { HeroBanner } from '@/components/lib/HeroBanner/HeroBanner';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <section>
      <HeroBanner />
      {user && (
        <>
          <p>Connecté en tant que {user.displayName}.</p>
          <LogoutButton />
        </>
      )}
    </section>
  );
}
