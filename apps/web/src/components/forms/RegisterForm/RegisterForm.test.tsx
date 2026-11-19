import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';
import type { AuthFieldErrors } from '@/types/auth';

import { RegisterForm } from './RegisterForm';

vi.mock('@/hooks/useAuth', () => ({ useAuth: vi.fn() }));

const register = vi.fn();
const clearFieldError = vi.fn();

const mockAuth = (error?: string, fieldErrors: AuthFieldErrors = {}) => {
  vi.mocked(useAuth).mockReturnValue({
    login: vi.fn(),
    register,
    logout: vi.fn(),
    isLoading: false,
    error,
    fieldErrors,
    clearError: vi.fn(),
    clearFieldError,
    hasInvalidCredentials: false,
    isLocked: false,
    lockedMinutes: 0,
  });
};

const fillForm = async (password = 'Archipel-du-n3ant', confirmation = password) => {
  await userEvent.type(screen.getByLabelText('Pseudonyme'), 'Maître Ying');
  await userEvent.type(screen.getByLabelText('Email'), 'MJ@Example.com');
  await userEvent.type(screen.getByLabelText('Mot de passe'), password);
  await userEvent.type(screen.getByLabelText('Confirmer le mot de passe'), confirmation);
};

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }));

describe('RegisterForm', () => {
  beforeEach(() => {
    register.mockReset();
    clearFieldError.mockReset();
    mockAuth();
  });

  it('shows the field errors given by useAuth', () => {
    mockAuth(undefined, {
      displayName: 'Le pseudonyme doit contenir entre 2 et 50 caractères',
      passwordConfirmation: 'Les mots de passe ne correspondent pas',
    });
    render(<RegisterForm />);

    expect(screen.getByLabelText('Pseudonyme')).toHaveAccessibleDescription(
      'Le pseudonyme doit contenir entre 2 et 50 caractères',
    );
    expect(screen.getByLabelText('Confirmer le mot de passe')).toHaveAccessibleDescription(
      'Les mots de passe ne correspondent pas',
    );
  });

  it('describes the password field with the state of each rule', async () => {
    render(<RegisterForm />);
    const password = screen.getByLabelText('Mot de passe');

    await userEvent.type(password, 'archipel-du-neant');
    expect(password).toHaveAccessibleDescription('Règles à respecter : Une majuscule, Un chiffre.');

    await userEvent.clear(password);
    await userEvent.type(password, 'Archipel-du-n3ant');
    expect(password).toHaveAccessibleDescription(
      'Toutes les règles du mot de passe sont respectées.',
    );
  });

  it('sends every typed value, confirmation included, to useAuth', async () => {
    render(<RegisterForm />);
    await fillForm();

    await submit();

    expect(register).toHaveBeenCalledWith({
      displayName: 'Maître Ying',
      email: 'MJ@Example.com',
      password: 'Archipel-du-n3ant',
      passwordConfirmation: 'Archipel-du-n3ant',
    });
  });

  it('asks useAuth to clear the error of the field being typed in', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText('Pseudonyme'), 'Y');

    expect(clearFieldError).toHaveBeenCalledWith('displayName');
  });

  it('shows the error returned by the API', () => {
    mockAuth('Un compte existe déjà avec cet e-mail');

    render(<RegisterForm />);

    expect(screen.getByRole('alert')).toHaveTextContent('Un compte existe déjà avec cet e-mail');
  });
});
