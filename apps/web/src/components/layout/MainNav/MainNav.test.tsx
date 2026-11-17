import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useArcane } from '@/context/ArcaneContext';

import { MainNav } from './MainNav';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/context/ArcaneContext', () => ({ useArcane: vi.fn() }));

const mockSession = (isAuthenticated: boolean) => {
  vi.mocked(useArcane).mockReturnValue({
    currentUser: isAuthenticated
      ? { id: '1', displayName: 'Maître Ying', email: 'mj@example.com' }
      : null,
    isAuthenticated,
    handleUser: vi.fn(),
  });
};

describe('MainNav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the login link to a guest', () => {
    mockSession(false);
    render(<MainNav />);

    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Connexion' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('link', { name: 'Tableau de bord' })).not.toBeInTheDocument();
  });

  it('shows the dashboard link instead of the login link to a signed-in GM', () => {
    mockSession(true);
    render(<MainNav />);

    expect(screen.getByRole('link', { name: 'Tableau de bord' })).toHaveAttribute(
      'href',
      '/dashboard',
    );
    expect(screen.queryByRole('link', { name: 'Connexion' })).not.toBeInTheDocument();
  });
});
