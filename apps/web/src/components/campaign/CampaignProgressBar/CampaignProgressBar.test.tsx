import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CampaignProgressBar } from './CampaignProgressBar';

describe('CampaignProgressBar', () => {
  it('shows the percentage and the "Progression" caption', () => {
    render(<CampaignProgressBar progress={100} color="third" />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Progression')).toBeInTheDocument();
  });

  it('exposes a single progress bar to screen readers', () => {
    render(<CampaignProgressBar progress={40} color="primary" />);

    const bar = screen.getByRole('progressbar', { name: 'Progression de la campagne' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuetext', '40 %');
    expect(screen.getByText('40%').parentElement).toHaveAttribute('aria-hidden', 'true');
  });
});
