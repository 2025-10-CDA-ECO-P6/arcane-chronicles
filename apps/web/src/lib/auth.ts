import { redirect } from 'next/navigation';
import { cache } from 'react';

import type { AuthUser } from '@/types/auth';

import { ApiError } from '@/lib/api';
import { getSessionToken, serverGet } from '@/lib/serverApi';

type Session =
  | { user: AuthUser; status: 'accepted' }
  | { user: null; status: 'missing' | 'rejected' | 'unavailable' };

const getSession = cache(async (): Promise<Session> => {
  if (!(await getSessionToken())) {
    return { user: null, status: 'missing' };
  }

  try {
    const user = await serverGet<AuthUser>('/auth/me');
    return { user, status: 'accepted' };
  } catch (error) {
    const isRejected = error instanceof ApiError && error.status === 401;
    return { user: null, status: isRejected ? 'rejected' : 'unavailable' };
  }
});

export const getCurrentUser = async (): Promise<AuthUser | null> => (await getSession()).user;

export const requireCurrentUser = async (pagePath: string): Promise<AuthUser> => {
  const session = await getSession();

  if (session.user) {
    return session.user;
  }

  if (session.status === 'unavailable') {
    throw new Error('The session could not be checked, the API is unavailable');
  }

  const target = encodeURIComponent(pagePath);
  redirect(
    session.status === 'rejected'
      ? `/session-expired?redirect=${target}`
      : `/login?redirect=${target}`,
  );
};
