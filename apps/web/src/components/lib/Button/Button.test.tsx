import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a button of type "button" by default', () => {
    render(<Button color="primary" buttonText="Valider" />);

    expect(screen.getByRole('button', { name: 'Valider' })).toHaveAttribute('type', 'button');
  });

  it('maps its props to the design system classes', () => {
    render(
      <Button
        color="gold"
        filled
        size="md"
        icon="play-fill"
        round
        buttonText="Lancer"
        className="extra"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass(
      'btn',
      'btn--gold',
      'btn--filled',
      'btn--md',
      'icon--play-fill',
      'btn--round',
      'extra',
    );
  });

  it('keeps the label for screen readers only when iconOnly is set', () => {
    render(<Button color="neutral" icon="menu-open" iconOnly buttonText="Ouvrir le menu" />);

    const button = screen.getByRole('button', { name: 'Ouvrir le menu' });
    expect(button).toHaveClass('btn--icon-only');
    expect(screen.getByText('Ouvrir le menu')).toHaveClass('sr-only');
  });

  it('calls handleClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button color="primary" buttonText="Annuler" handleClick={handleClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
