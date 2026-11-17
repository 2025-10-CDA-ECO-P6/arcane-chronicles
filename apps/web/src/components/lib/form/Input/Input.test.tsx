import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('links the label to the field', () => {
    render(<Input label="Email" inputType="email" name="email" />);

    const field = screen.getByLabelText('Email');
    expect(field).toHaveAttribute('type', 'email');
    expect(field).toHaveAttribute('name', 'email');
    expect(field).not.toHaveAttribute('aria-invalid');
  });

  it('shows the error and links it to the field', () => {
    render(<Input label="Mot de passe" inputType="password" error="Mot de passe obligatoire" />);

    const field = screen.getByLabelText('Mot de passe');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Mot de passe obligatoire');
  });

  it('hides the label visually when srOnly is set', () => {
    render(<Input label="Rechercher" srOnly />);

    expect(screen.getByText('Rechercher')).toHaveClass('sr-only');
    expect(screen.getByLabelText('Rechercher')).toBeInTheDocument();
  });

  it('calls handleChange on each keystroke', async () => {
    const handleChange = vi.fn();
    render(<Input label="Email" handleChange={handleChange} />);

    await userEvent.type(screen.getByLabelText('Email'), 'abc');

    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('can be marked invalid without its own message', () => {
    render(<Input label="Email" invalid />);

    const field = screen.getByLabelText('Email');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).not.toHaveAttribute('aria-describedby');
  });
});
