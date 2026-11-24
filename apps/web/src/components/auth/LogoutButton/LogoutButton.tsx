'use client';

import { Button } from '@/components/lib/Button/Button';

import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { logout, error } = useAuth();

  return (
    <>
      <Button color="neutral" buttonText="Se déconnecter" handleClick={logout} />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
