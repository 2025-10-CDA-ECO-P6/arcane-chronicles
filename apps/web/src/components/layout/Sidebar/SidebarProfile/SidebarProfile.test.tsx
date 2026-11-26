import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AuthUser } from '@/types/auth';

import { SidebarProfile } from './SidebarProfile';

const user: AuthUser = {
  id: 'user-1',
  displayName: 'Lubin',
  email: 'mj@example.com',
  avatarUrl: null,
};

describe('SidebarProfile', () => {
  it('shows the initial of the GM when there is no avatar', () => {
    const { container } = render(
      <SidebarProfile user={user} campaignCount={4} inProgressCount={2} />,
    );

    expect(screen.getByText('L')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('shows the avatar of the GM when there is one', () => {
    const { container } = render(
      <SidebarProfile
        user={{ ...user, avatarUrl: '/avatars/lubin.webp' }}
        campaignCount={4}
        inProgressCount={2}
      />,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', '/avatars/lubin.webp');
    expect(screen.queryByText('L')).not.toBeInTheDocument();
  });

  it('shows the name and the campaign counts', () => {
    render(<SidebarProfile user={user} campaignCount={4} inProgressCount={2} />);

    expect(screen.getByText('Lubin')).toBeInTheDocument();
    expect(screen.getByText('Campagnes : 4')).toBeInTheDocument();
    expect(screen.getByText('En cours : 2')).toBeInTheDocument();
  });
});
