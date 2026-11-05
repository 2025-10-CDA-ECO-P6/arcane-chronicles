import type { Metadata } from 'next';

import { cinzel, crimsonText, icons, inter } from '@/lib/fonts';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Arcane Chronicles',
  description: "Application web d'aide au Maître du Jeu pour Donjons & Dragons 5e.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${inter.variable} ${crimsonText.variable} ${icons.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
