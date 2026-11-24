import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  it('shows its content', () => {
    render(<Tag text="En cours" />);

    expect(screen.getByText('En cours')).toBeInTheDocument();
  });

  it('takes the color chosen by the developer', () => {
    render(<Tag color="gold" text="Légendaire" />);

    expect(screen.getByText('Légendaire')).toHaveClass('tag', 'tag--gold');
  });

  it('uses primary by default', () => {
    render(<Tag text="À jouer" />);

    expect(screen.getByText('À jouer')).toHaveClass('tag', 'tag--primary');
  });

  it('shows a dot when asked', () => {
    const { container } = render(<Tag text="En cours" dot />);

    expect(container.querySelector('.dot')).toBeInTheDocument();
  });

  it('keeps the class given by the parent', () => {
    render(<Tag className="campaign-card__status" text="Terminée" />);

    expect(screen.getByText('Terminée')).toHaveClass('tag', 'campaign-card__status');
  });
});
