'use client';

import { type ChangeEvent, type SubmitEvent, useId, useState } from 'react';

import { Button } from '@/components/lib/Button/Button';
import { Input } from '@/components/lib/form/Input/Input';
import { PasswordStrength } from '@/components/lib/form/PasswordStrength/PasswordStrength';
import { useAuth } from '@/hooks/useAuth';
import type { AuthField, RegisterValues } from '@/types/auth';

import styles from './RegisterForm.module.scss';

const EMPTY_VALUES: RegisterValues = {
  displayName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export function RegisterForm() {
  const { register, error, fieldErrors, clearFieldError, isLoading } = useAuth();
  const [values, setValues] = useState<RegisterValues>(EMPTY_VALUES);
  const passwordRulesId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    clearFieldError(name as AuthField);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await register(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <div className={styles.form__fields}>
        <Input
          label="Pseudonyme"
          name="displayName"
          autoComplete="nickname"
          required
          value={values.displayName}
          handleChange={handleChange}
          error={fieldErrors.displayName}
        />
        <Input
          label="Email"
          inputType="email"
          name="email"
          autoComplete="email"
          required
          value={values.email}
          handleChange={handleChange}
          error={fieldErrors.email}
        />
        <div className={styles.form__password}>
          <Input
            label="Mot de passe"
            inputType="password"
            name="password"
            autoComplete="new-password"
            required
            value={values.password}
            handleChange={handleChange}
            error={fieldErrors.password}
            aria-describedby={passwordRulesId}
          />
          <PasswordStrength password={values.password} rulesId={passwordRulesId} />
        </div>
        <Input
          label="Confirmer le mot de passe"
          inputType="password"
          name="passwordConfirmation"
          autoComplete="new-password"
          required
          value={values.passwordConfirmation}
          handleChange={handleChange}
          error={fieldErrors.passwordConfirmation}
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button
        buttonType="submit"
        color="primary"
        filled
        buttonText="Créer mon compte"
        size="md"
        disabled={isLoading}
      />
    </form>
  );
}
