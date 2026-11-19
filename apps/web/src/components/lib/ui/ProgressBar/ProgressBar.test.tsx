import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getProgressPercentage, ProgressBar } from './ProgressBar';

describe('getProgressPercentage', () => {
  it('turns a value between min and max into a percentage', () => {
    expect(getProgressPercentage(3, 0, 5)).toBe(60);
    expect(getProgressPercentage(15, 10, 20)).toBe(50);
  });

  it('stays between 0 and 100 when the value goes past the limits', () => {
    expect(getProgressPercentage(-4, 0, 5)).toBe(0);
    expect(getProgressPercentage(9, 0, 5)).toBe(100);
  });

  it('gives 0 when max is not above min', () => {
    expect(getProgressPercentage(3, 5, 5)).toBe(0);
  });
});

describe('ProgressBar', () => {
  it('passes the percentage to the styles', () => {
    const { container } = render(<ProgressBar value={37} max={50} />);

    expect(container.firstChild).toHaveStyle({ '--progress-value': '74%' });
  });

  it('describes its progress to assistive technologies when it has a label', () => {
    render(
      <ProgressBar value={3} max={11} label="Chapitres joués" valueText="3 chapitres sur 11" />,
    );

    const progress = screen.getByRole('progressbar', { name: 'Chapitres joués' });
    expect(progress).toHaveAttribute('aria-valuenow', '3');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '11');
    expect(progress).toHaveAttribute('aria-valuetext', '3 chapitres sur 11');
  });

  it('is hidden from assistive technologies without a label', () => {
    const { container } = render(<ProgressBar value={3} max={5} />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('switches to its complete colour once full', () => {
    const { container, rerender } = render(
      <ProgressBar value={4} max={5} color="hostile" completeColor="primary" />,
    );
    expect(container.firstChild).toHaveClass('progress--hostile');

    rerender(<ProgressBar value={5} max={5} color="hostile" completeColor="primary" />);
    expect(container.firstChild).toHaveClass('progress--primary');
  });
});
