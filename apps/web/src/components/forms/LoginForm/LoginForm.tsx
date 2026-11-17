'use client';

import { type LoginInput, loginSchema } from '@arcane-chronicles/shared';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import { Button } from '@/components/lib/Button/Button';
import { Input } from '@/components/lib/form/Input/Input';
import { useAuth } from '@/hooks/useAuth';

import styles from './LoginForm.module.scss';
import type { LoginFormErrors, LoginFormProps } from './LoginForm.types';

const FIELD_MESSAGES = {
  email: 'Adresse e-mail invalide',
  password: 'Mot de passe obligatoire',
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const { login, error, clearError } = useAuth();
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const invalidFields = result.error.issues.map((issue) => issue.path[0]);
      setErrors({
        email: invalidFields.includes('email') ? FIELD_MESSAGES.email : undefined,
        password: invalidFields.includes('password') ? FIELD_MESSAGES.password : undefined,
      });
      clearError();
      return;
    }

    setErrors({});
    console.log('success');

    await login(result.data, redirectTo);
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
        error={errors.email}
      />
      <Input
        label="Mot de passe"
        inputType="password"
        name="password"
        autoComplete="current-password"
        required
        value={values.password}
        handleChange={handleChange}
        error={errors.password}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Button buttonType="submit" color="primary" filled buttonText="Se connecter" size="md" />
    </form>
  );
}
