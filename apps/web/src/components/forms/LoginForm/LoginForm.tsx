'use client';

import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import type { LoginInput } from '@arcane-chronicles/shared';
import type { LoginFormProps } from './LoginForm.types';

import { Button } from '@/components/lib/Button/Button';
import { Input } from '@/components/lib/form/Input/Input';

import { useAuth } from '@/hooks/useAuth';
import styles from './LoginForm.module.scss';

export function LoginForm({ redirectTo }: LoginFormProps) {
  const {
    login,
    error,
    fieldErrors,
    clearFieldError,
    hasInvalidCredentials,
    isLocked,
    lockedMinutes,
  } = useAuth();
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    clearFieldError(name as keyof LoginInput);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(values, redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <Input
        label="Email"
        inputType="email"
        name="email"
        autoComplete="email"
        required
        value={values.email}
        handleChange={handleChange}
        error={fieldErrors.email}
        invalid={hasInvalidCredentials}
        disabled={isLocked}
      />
      <Input
        label="Mot de passe"
        inputType="password"
        name="password"
        autoComplete="current-password"
        required
        value={values.password}
        handleChange={handleChange}
        error={fieldErrors.password}
        invalid={hasInvalidCredentials}
        disabled={isLocked}
      />
      {isLocked && (
        <p className="form-error" role="status">
          Trop de tentatives de connexion. Vous pourrez réessayer dans {lockedMinutes} min.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button
        buttonType="submit"
        color={isLocked ? 'hostile' : 'primary'}
        filled
        buttonText="Se connecter"
        size="md"
        disabled={isLocked}
      />
    </form>
  );
}
