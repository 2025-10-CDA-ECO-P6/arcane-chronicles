import type { Metadata } from 'next';

import { Header } from '@/components/layout/Header/Header';
import { ArcaneProvider } from '@/context/ArcaneContext';
import { getCurrentUser } from '@/lib/auth';
import { cinzel, crimsonText, icons, inter } from '@/lib/fonts';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Arcane Chronicles',
  description: "Application web d'aide au Maître du Jeu pour Donjons & Dragons 5e.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${inter.variable} ${crimsonText.variable} ${icons.variable}`}
    >
      <body>
        <ArcaneProvider initialUser={user}>
          <Header />
          <main>{children}</main>
        </ArcaneProvider>
      </body>
    </html>
  );
}
