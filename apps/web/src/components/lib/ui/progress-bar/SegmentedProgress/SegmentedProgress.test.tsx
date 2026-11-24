import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SegmentedProgress } from './SegmentedProgress';

describe('SegmentedProgress', () => {
  it('draws one segment per step with its status', () => {
    const { container } = render(
      <SegmentedProgress segments={['done', 'current', 'todo']} label="Chapitres" />,
    );

    const segments = container.querySelectorAll('.segmented-progress__segment');
    expect(segments).toHaveLength(3);
    expect(segments[0]).toHaveClass('segmented-progress__segment--done');
    expect(segments[1]).toHaveClass('segmented-progress__segment--current');
    expect(segments[2]).toHaveClass('segmented-progress__segment--todo');
  });

  it('describes its progress to assistive technologies', () => {
    render(
      <SegmentedProgress
        segments={['done', 'done', 'current', 'todo']}
        label="Chapitres"
        valueText="2 chapitres terminés sur 4"
      />,
    );

    const progress = screen.getByRole('progressbar', { name: 'Chapitres' });
    expect(progress).toHaveAttribute('aria-valuenow', '2');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '4');
    expect(progress).toHaveAttribute('aria-valuetext', '2 chapitres terminés sur 4');
  });

  it('fills the current segment with its own progress', () => {
    const { rerender } = render(
      <SegmentedProgress segments={['done', 'current', 'todo']} label="Chapitres" />,
    );
    expect(screen.getByRole('progressbar')).toHaveStyle({ '--current-progress': '0%' });

    rerender(
      <SegmentedProgress
        segments={['done', 'current', 'todo']}
        currentProgress={40}
        label="Chapitres"
      />,
    );
    expect(screen.getByRole('progressbar')).toHaveStyle({ '--current-progress': '40%' });
  });

  it('uses primary by default and takes the chosen color', () => {
    const { rerender } = render(<SegmentedProgress segments={['todo']} label="Chapitres" />);
    expect(screen.getByRole('progressbar')).toHaveClass('segmented-progress--primary');

    rerender(<SegmentedProgress segments={['todo']} label="Chapitres" color="gold" />);
    expect(screen.getByRole('progressbar')).toHaveClass('segmented-progress--gold');
  });
});
