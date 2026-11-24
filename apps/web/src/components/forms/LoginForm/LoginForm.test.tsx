import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthFieldErrors } from '@/types/auth';

import { LoginForm } from './LoginForm';

import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));

const login = vi.fn();
const clearFieldError = vi.fn();

const mockAuth = (
  error?: string,
  lockedMinutes = 0,
  hasInvalidCredentials = false,
  fieldErrors: AuthFieldErrors = {},
) => {
  vi.mocked(useAuth).mockReturnValue({
    login,
    register: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    error,
    fieldErrors,
    clearError: vi.fn(),
    clearFieldError,
    hasInvalidCredentials,
    isLocked: lockedMinutes > 0,
    lockedMinutes,
  });
};

describe('LoginForm', () => {
  beforeEach(() => {
    login.mockReset();
    clearFieldError.mockReset();
    mockAuth();
  });

  it('shows the field errors given by useAuth', () => {
    mockAuth(undefined, 0, false, {
      email: 'Adresse e-mail invalide',
      password: 'Mot de passe obligatoire',
    });
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Adresse e-mail invalide');
    expect(screen.getByLabelText('Mot de passe')).toHaveAccessibleDescription(
      'Mot de passe obligatoire',
    );
  });

  it('asks useAuth to clear the error of the field being typed in', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'm');

    expect(clearFieldError).toHaveBeenCalledWith('email');
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

  it('marks both fields as invalid when the credentials are wrong', () => {
    mockAuth('Email ou mot de passe incorrect', 0, true);
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('aria-invalid', 'true');
  });

  it('turns the button red while locked', () => {
    mockAuth(undefined, 12);
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: 'Se connecter' })).toHaveClass('btn--hostile');
  });
});
