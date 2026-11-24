import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CampaignCounts } from './CampaignCounts';

describe('CampaignCounts', () => {
  it('shows each count with its label', () => {
    render(<CampaignCounts counts={{ chapters: 8, quests: 1, sessions: 0, heroes: 5 }} />);

    expect(screen.getByText('8 chapitres')).toBeInTheDocument();
    expect(screen.getByText('1 quête')).toBeInTheDocument();
    expect(screen.getByText('Aucune session')).toBeInTheDocument();
    expect(screen.getByText('5 héros')).toBeInTheDocument();
  });

  it('gives each count its icon', () => {
    render(<CampaignCounts counts={{ chapters: 8, quests: 1, sessions: 0, heroes: 5 }} />);

    expect(screen.getByText('8 chapitres')).toHaveClass('icon--book-outline');
  });
});
