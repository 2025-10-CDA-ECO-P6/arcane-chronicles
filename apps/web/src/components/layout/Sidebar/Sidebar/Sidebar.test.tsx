import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { CampaignSummary } from '@arcane-chronicles/shared';
import type { AuthUser } from '@/types/auth';

import { Sidebar } from './Sidebar';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard/campaigns' }));

const user: AuthUser = {
  id: 'user-1',
  displayName: 'Lubin',
  email: 'mj@example.com',
  avatarUrl: null,
};

const campaign = (id: string, status: CampaignSummary['status'], lastSessionAt: string | null) =>
  ({
    id,
    title: `Campagne ${id}`,
    status,
    lastSessionAt,
    imageUrl: null,
    progress: 0,
    currentChapter: null,
  }) as CampaignSummary;

const resumeTitles = () =>
  within(screen.getByRole('region', { name: 'Reprendre' }))
    .queryAllByRole('listitem')
    .map((item) => item.textContent);

describe('Sidebar', () => {
  it('lists the campaigns to resume, from the most recent session', () => {
    render(
      <Sidebar
        user={user}
        campaigns={[
          campaign('october', 'IN_PROGRESS', '2026-10-12T18:30:00.000Z'),
          campaign('new', 'NEW', null),
          campaign('november', 'IN_PROGRESS', '2026-11-20T18:30:00.000Z'),
        ]}
      />,
    );

    expect(resumeTitles()).toEqual(['Campagne november', 'Campagne october']);
    expect(screen.queryByRole('link', { name: 'Voir plus' })).not.toBeInTheDocument();
  });

  it('keeps 3 campaigns at most and links to the others', () => {
    const campaigns = ['01', '02', '03', '04'].map((day) =>
      campaign(day, 'IN_PROGRESS', `2026-11-${day}T18:30:00.000Z`),
    );
    render(<Sidebar user={user} campaigns={campaigns} />);

    expect(resumeTitles()).toEqual(['Campagne 04', 'Campagne 03', 'Campagne 02']);
    expect(screen.getByRole('link', { name: 'Voir plus' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns?status=IN_PROGRESS',
    );
  });

  it('says so when there is no campaign in progress', () => {
    render(<Sidebar user={user} campaigns={[campaign('new', 'NEW', null)]} />);

    expect(screen.getByText('Aucune campagne en cours')).toBeInTheDocument();
    expect(resumeTitles()).toEqual([]);
  });

  it('counts the campaigns in the profile and in the workshop link', () => {
    render(
      <Sidebar
        user={user}
        campaigns={[
          campaign('playing', 'IN_PROGRESS', '2026-11-20T18:30:00.000Z'),
          campaign('new', 'NEW', null),
        ]}
      />,
    );

    expect(screen.getByText('Campagnes : 2')).toBeInTheDocument();
    expect(screen.getByText('En cours : 1')).toBeInTheDocument();
    const workshop = screen.getByRole('navigation', { name: 'Mon atelier' });
    expect(within(workshop).getByRole('link', { name: /Campagnes/ })).toHaveTextContent('2');
  });
});
