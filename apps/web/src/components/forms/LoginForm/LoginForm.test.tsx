import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';

import { LoginForm } from './LoginForm';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));

const login = vi.fn();
const clearError = vi.fn();

const mockAuth = (error?: string, lockedMinutes = 0) => {
  vi.mocked(useAuth).mockReturnValue({
    login,
    logout: vi.fn(),
    isLoading: false,
    error,
    clearError,
    isLocked: lockedMinutes > 0,
    lockedMinutes,
  });
};

describe('LoginForm', () => {
  beforeEach(() => {
    login.mockReset();
    clearError.mockReset();
    mockAuth();
  });

  it('shows French field errors and does not call the API on an empty submit', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Adresse e-mail invalide');
    expect(screen.getByLabelText('Mot de passe')).toHaveAccessibleDescription(
      'Mot de passe obligatoire',
    );
    expect(login).not.toHaveBeenCalled();
    expect(clearError).toHaveBeenCalled();
  });

  it('clears a field error as soon as the user types in that field', async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    await userEvent.type(screen.getByLabelText('Email'), 'm');

    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sends the credentials and the redirect target', async () => {
    render(<LoginForm redirectTo="/dashboard" />);

    await userEvent.type(screen.getByLabelText('Email'), 'mj@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret');
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }));

    expect(login).toHaveBeenCalledWith(
      { email: 'mj@example.com', password: 'secret' },
      '/dashboard',
    );
  });

  it('shows the login error returned by useAuth', () => {
    mockAuth('Email ou mot de passe incorrect');
    render(<LoginForm />);

    expect(screen.getByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect');
  });

  it('locks the fields and the button and tells how long to wait after too many attempts', async () => {
    mockAuth(undefined, 12);
    render(<LoginForm />);

    expect(screen.getByRole('status')).toHaveTextContent(
      'Trop de tentatives de connexion. Vous pourrez réessayer dans 12 min.',
    );
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Mot de passe')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeDisabled();
  });
});
