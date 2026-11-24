import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CampaignSummary } from '@arcane-chronicles/shared';

import { CampaignProgress } from './CampaignProgress';

const campaign: CampaignSummary = {
  id: 'campaign-1',
  title: 'L’archipel du néant',
  description: 'Une quête au cœur des îles flottantes.',
  imageUrl: null,
  createdAt: '2026-08-20T10:00:00Z',
  status: 'IN_PROGRESS',
  progress: 54,
  chapterStatuses: ['COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'NEW'],
  currentChapter: { position: 3, title: 'Les ruines de l’observatoire', progress: 25 },
  counts: { chapters: 4, quests: 2, sessions: 3, heroes: 5 },
  lastSessionAt: null,
  completedAt: null,
  publication: { isPublished: false, hasUnpublishedChanges: false },
};

describe('CampaignProgress', () => {
  it('shows the overall progress and the current chapter', () => {
    render(<CampaignProgress campaign={campaign} color="primary" />);

    expect(
      screen.getByRole('progressbar', { name: 'Progression de la campagne' }),
    ).toHaveTextContent('54%');
    expect(screen.getByRole('heading', { level: 3, name: 'Progression' })).toBeInTheDocument();
    expect(screen.getByText('Chapitre 3')).toBeInTheDocument();
    expect(screen.getByText('Les ruines de l’observatoire')).toBeInTheDocument();
  });

  it('draws one segment per chapter', () => {
    render(<CampaignProgress campaign={campaign} color="primary" />);

    const chapters = screen.getByRole('progressbar', { name: 'Chapitres de la campagne' });
    expect(chapters).toHaveAttribute('aria-valuenow', '2');
    expect(chapters).toHaveAttribute(
      'aria-valuetext',
      '2 chapitres terminés sur 4, chapitre en cours à 25 %',
    );
    expect(chapters).toHaveStyle({ '--current-progress': '25%' });
  });
});
