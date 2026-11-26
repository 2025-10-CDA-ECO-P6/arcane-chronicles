import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SidebarLink } from './SidebarLink';

const navigation = vi.hoisted(() => ({ pathname: '/dashboard/campaigns' }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));

const renderLink = () =>
  render(
    <SidebarLink
      href="/dashboard/campaigns"
      icon="spiked-dragon-head"
      label="Campagnes"
      count={4}
    />,
  );

describe('SidebarLink', () => {
  it('links to its page and shows the count', () => {
    navigation.pathname = '/dashboard/characters';
    renderLink();

    expect(screen.getByRole('link', { name: /Campagnes/ })).toHaveAttribute(
      'href',
      '/dashboard/campaigns',
    );
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('is the current page on its page and on the pages below it', () => {
    for (const pathname of ['/dashboard/campaigns', '/dashboard/campaigns/campaign-1']) {
      navigation.pathname = pathname;
      const { unmount } = renderLink();

      expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
      unmount();
    }
  });

  it('is not the current page elsewhere, even on a path that starts the same way', () => {
    for (const pathname of ['/dashboard/characters', '/dashboard/campaigns-archive']) {
      navigation.pathname = pathname;
      const { unmount } = renderLink();

      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
      unmount();
    }
  });
});
