'use client';

import type { MainNavProps } from './MainNav.types';

import { NavLink } from '@/components/lib/NavLink/NavLink';

import { useArcane } from '@/context/ArcaneContext';

export function MainNav({ className }: MainNavProps) {
  const { isAuthenticated } = useArcane();

  return (
    <nav className={className} aria-label="Navigation principale">
      <NavLink className="link--text-secondary" href="/">
        Accueil
      </NavLink>
      {isAuthenticated ? (
        <NavLink className="link--text-secondary" href="/dashboard/campaigns">
          Tableau de bord
        </NavLink>
      ) : (
        <>
          <NavLink className="link--text-secondary" href="/login">
            Connexion
          </NavLink>
          <NavLink className="link--text-secondary" href="/register">
            Inscription
          </NavLink>
        </>
      )}
    </nav>
  );
}
