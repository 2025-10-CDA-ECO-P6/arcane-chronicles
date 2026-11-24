import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('shows the percentage in the middle', () => {
    render(<ProgressRing value={54} label="Progression" />);

    expect(screen.getByText('54%')).toBeInTheDocument();
  });

  it('passes the percentage to the styles', () => {
    render(<ProgressRing value={54} label="Progression" />);

    expect(screen.getByRole('progressbar')).toHaveStyle({ '--progress-value': '54%' });
  });

  it('describes its progress to assistive technologies', () => {
    render(<ProgressRing value={54} label="Progression de la campagne" />);

    const ring = screen.getByRole('progressbar', { name: 'Progression de la campagne' });
    expect(ring).toHaveAttribute('aria-valuenow', '54');
    expect(ring).toHaveAttribute('aria-valuemin', '0');
    expect(ring).toHaveAttribute('aria-valuemax', '100');
  });

  it('stays between 0 and 100', () => {
    const { rerender } = render(<ProgressRing value={-10} label="Progression" />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<ProgressRing value={140} label="Progression" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('uses primary by default and takes the chosen color', () => {
    const { rerender } = render(<ProgressRing value={54} label="Progression" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-ring', 'progress-ring--primary');

    rerender(<ProgressRing value={54} label="Progression" color="gold" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-ring--gold');
  });

  it('matches the background it sits on', () => {
    const { rerender } = render(<ProgressRing value={54} label="Progression" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-ring--on-primary');

    rerender(<ProgressRing value={54} label="Progression" background="secondary" />);
    expect(screen.getByRole('progressbar')).toHaveClass('progress-ring--on-secondary');
  });
});
