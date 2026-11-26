import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CampaignSummary } from '@arcane-chronicles/shared';

import { ResumeCampaignLink } from './ResumeCampaignLink';

const campaign = {
  id: 'campaign-1',
  title: 'L’archipel du néant',
  imageUrl: null,
  progress: 40,
  currentChapter: { position: 2, title: 'Les brumes', progress: 75 },
} as CampaignSummary;

describe('ResumeCampaignLink', () => {
  it('links to the campaign', () => {
    render(<ResumeCampaignLink campaign={campaign} />);

    expect(screen.getByRole('link', { name: /L’archipel du néant/ })).toHaveAttribute(
      'href',
      '/dashboard/campaigns/campaign-1',
    );
  });

  it('shows the current chapter and its progress', () => {
    render(<ResumeCampaignLink campaign={campaign} />);

    expect(screen.getByText('Chapitre 2 - 75%')).toBeInTheDocument();
  });

  it('fills the bar with the progress of the whole campaign', () => {
    const { container } = render(<ResumeCampaignLink campaign={campaign} />);

    const bar = container.querySelector<HTMLElement>('[style*="--progress-value"]');
    expect(bar?.style.getPropertyValue('--progress-value')).toBe('40%');
  });

  it('leaves out the chapter line when there is no current chapter', () => {
    render(<ResumeCampaignLink campaign={{ ...campaign, currentChapter: null }} />);

    expect(screen.queryByText(/Chapitre/)).not.toBeInTheDocument();
  });
});
