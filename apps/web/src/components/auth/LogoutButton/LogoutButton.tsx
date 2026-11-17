'use client';

import { Button } from '@/components/lib/Button/Button';
import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();

  return <Button color="neutral" buttonText="Se déconnecter" handleClick={logout} />;
}
