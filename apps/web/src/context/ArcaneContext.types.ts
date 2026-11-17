import type { ReactNode } from 'react';

import type { AuthUser } from '@/types/auth';

export interface ArcaneProviderProps {
  children: ReactNode;
  initialUser: AuthUser | null;
}

export interface ArcaneContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  handleUser: (user: AuthUser | null) => void;
}
