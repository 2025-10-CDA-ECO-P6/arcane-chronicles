import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SidebarShell } from './SidebarShell';

const sidebar = vi.hoisted(() => ({ isOpen: true }));

vi.mock('@/context/ArcaneContext', () => ({
  useArcane: () => ({ isSidebarOpen: sidebar.isOpen }),
}));

describe('SidebarShell', () => {
  it('is the named landmark controlled by the menu button, with its content', () => {
    sidebar.isOpen = true;
    render(
      <SidebarShell>
        <p>Contenu</p>
      </SidebarShell>,
    );

    const aside = screen.getByRole('complementary', { name: 'Menu de l’espace MJ' });
    expect(aside).toHaveAttribute('id', 'gm-sidebar');
    expect(aside).not.toHaveClass('sidebar--closed');
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('is marked closed when the context says so', () => {
    sidebar.isOpen = false;
    render(
      <SidebarShell>
        <p>Contenu</p>
      </SidebarShell>,
    );

    expect(screen.getByRole('complementary')).toHaveClass('sidebar--closed');
  });
});
