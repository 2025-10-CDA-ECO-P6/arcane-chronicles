'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { AuthUser } from '@/types/auth';
import type { ArcaneContextValue, ArcaneProviderProps } from './ArcaneContext.types';

import { sidebarCookie } from '@/lib/sidebar';

const ArcaneContext = createContext<ArcaneContextValue | null>(null);

export function ArcaneProvider({
  children,
  initialUser,
  initialSidebarOpen = true,
}: ArcaneProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser);
  const [serverUser, setServerUser] = useState<AuthUser | null>(initialUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialSidebarOpen);

  if (initialUser !== serverUser) {
    setServerUser(initialUser);
    setCurrentUser(initialUser);
  }

  const handleUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((isSidebarOpen) => !isSidebarOpen);
  }, []);

  useEffect(() => {
    document.cookie = sidebarCookie(isSidebarOpen);
  }, [isSidebarOpen]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      handleUser,
      isSidebarOpen,
      toggleSidebar,
    }),
    [currentUser, handleUser, isSidebarOpen, toggleSidebar],
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
