import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { NavLink } from './NavLink';

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));

const renderAt = (pathname: string, href: string, exact?: boolean) => {
  vi.mocked(usePathname).mockReturnValue(pathname);
  render(
    <NavLink href={href} exact={exact}>
      Lien
    </NavLink>,
  );
  return screen.getByRole('link', { name: 'Lien' });
};

describe('NavLink', () => {
  it('marks the link of the current page', () => {
    const link = renderAt('/login', '/login');

    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('link', 'link--no-underline');
  });

  it('marks a section link on its sub-pages', () => {
    expect(renderAt('/campaigns/42', '/campaigns')).toHaveAttribute('aria-current', 'page');
  });

  it('marks the home link only on the home page', () => {
    expect(renderAt('/login', '/')).not.toHaveAttribute('aria-current');
  });

  it('ignores sub-pages when exact is set', () => {
    expect(renderAt('/campaigns/42', '/campaigns', true)).not.toHaveAttribute('aria-current');
  });

  it('does not mark a link that only shares a prefix', () => {
    expect(renderAt('/campaignsarchive', '/campaigns')).not.toHaveAttribute('aria-current');
  });
});
