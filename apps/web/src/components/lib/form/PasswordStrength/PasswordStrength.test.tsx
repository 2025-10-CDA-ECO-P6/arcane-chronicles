import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PasswordStrength } from './PasswordStrength';

const rulesButton = () => screen.getByRole('button', { name: 'Règles du mot de passe' });

describe('PasswordStrength', () => {
  it('keeps the rules hidden until the info button is pressed', async () => {
    render(<PasswordStrength password="" />);

    expect(rulesButton()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await userEvent.click(rulesButton());

    expect(rulesButton()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('list')).toBeVisible();
  });

  it('tells which rules are met and which are not', async () => {
    render(<PasswordStrength password="archipel1" />);
    await userEvent.click(rulesButton());

    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items).toEqual([
      '✗Entre 12 et 128 caractères : non respectée',
      '✗Une majuscule : non respectée',
      '✓Une minuscule : respectée',
      '✓Un chiffre : respectée',
      '✗Un caractère spécial : non respectée',
    ]);
  });

  it('sums up the missing rules under the id given for the field description', () => {
    const { container, rerender } = render(
      <PasswordStrength password="archipel1" rulesId="password-rules" />,
    );
    const summary = () => container.querySelector('#password-rules');

    expect(summary()).toHaveTextContent(
      'Règles à respecter : Entre 12 et 128 caractères, Une majuscule, Un caractère spécial.',
    );

    rerender(<PasswordStrength password="Archipel-du-n3ant" rulesId="password-rules" />);
    expect(summary()).toHaveTextContent('Toutes les règles du mot de passe sont respectées.');
  });

  it('fills the bar with the share of rules met, in the complete colour once all are met', () => {
    const { container, rerender } = render(<PasswordStrength password="archipel1" />);
    const bar = () => container.querySelector('[aria-hidden="true"]');

    expect(bar()).toHaveStyle({ '--progress-value': '40%' });
    expect(bar()).toHaveClass('progress--hostile');

    rerender(<PasswordStrength password="Archipel-du-n3ant" />);

    expect(bar()).toHaveStyle({ '--progress-value': '100%' });
    expect(bar()).toHaveClass('progress--primary');
  });

  it('closes the rules with Escape and with a click outside', async () => {
    render(
      <>
        <PasswordStrength password="" />
        <p>Ailleurs</p>
      </>,
    );

    await userEvent.click(rulesButton());
    await userEvent.keyboard('{Escape}');
    expect(rulesButton()).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(rulesButton());
    await userEvent.click(screen.getByText('Ailleurs'));
    expect(rulesButton()).toHaveAttribute('aria-expanded', 'false');
  });
});
