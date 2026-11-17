'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { AuthUser } from '@/types/auth';

import type { ArcaneContextValue, ArcaneProviderProps } from './ArcaneContext.types';

const ArcaneContext = createContext<ArcaneContextValue | null>(null);

export function ArcaneProvider({ children, initialUser }: ArcaneProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser);

  const handleUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isLogged: currentUser !== null,
      handleUser,
    }),
    [currentUser, handleUser],
  );

  return <ArcaneContext.Provider value={value}>{children}</ArcaneContext.Provider>;
}

export const useArcane = () => {
  const context = useContext(ArcaneContext);

  if (!context) {
    throw new Error('useArcane must be used inside ArcaneProvider');
  }

  return context;
};
