import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Tableau de bord | Arcane Chronicles',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/tableau-de-bord');
  }

  return (
    <section>
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {user.displayName}.</p>
    </section>
  );
}
