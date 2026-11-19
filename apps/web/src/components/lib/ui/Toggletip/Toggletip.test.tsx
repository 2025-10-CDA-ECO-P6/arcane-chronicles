import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Toggletip } from './Toggletip';

const toggleButton = () => screen.getByRole('button', { name: 'Aide' });

describe('Toggletip', () => {
  it('hides its content until its button is pressed, and links the button to it', async () => {
    render(<Toggletip label="Aide">Contenu de la bulle</Toggletip>);

    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Contenu de la bulle')).not.toBeVisible();

    await userEvent.click(toggleButton());

    expect(toggleButton()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Contenu de la bulle')).toBeVisible();
    expect(toggleButton()).toHaveAttribute(
      'aria-controls',
      screen.getByText('Contenu de la bulle').id,
    );
  });

  it('closes with Escape and with a click outside', async () => {
    render(
      <>
        <Toggletip label="Aide">Contenu de la bulle</Toggletip>
        <p>Ailleurs</p>
      </>,
    );

    await userEvent.click(toggleButton());
    await userEvent.keyboard('{Escape}');
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(toggleButton());
    await userEvent.click(screen.getByText('Ailleurs'));
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens below its button by default, or above it when asked', () => {
    const { rerender } = render(<Toggletip label="Aide">Contenu de la bulle</Toggletip>);
    expect(screen.getByText('Contenu de la bulle')).toHaveClass('toggletip__panel--bottom');

    rerender(
      <Toggletip label="Aide" placement="top">
        Contenu de la bulle
      </Toggletip>,
    );
    expect(screen.getByText('Contenu de la bulle')).toHaveClass('toggletip__panel--top');
  });
});
