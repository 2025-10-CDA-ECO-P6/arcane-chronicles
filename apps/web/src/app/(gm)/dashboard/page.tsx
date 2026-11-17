import type { Metadata } from 'next';

import { requireCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Tableau de bord | Arcane Chronicles',
};

export default async function DashboardPage() {
  const user = await requireCurrentUser('/dashboard');

  return (
    <section>
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {user.displayName}.</p>
    </section>
  );
}
