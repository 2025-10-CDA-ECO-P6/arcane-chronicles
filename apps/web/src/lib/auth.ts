import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { ApiError, apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

type Session =
  | { user: AuthUser; status: 'accepted' }
  | { user: null; status: 'missing' | 'rejected' | 'unavailable' };

const getSession = cache(async (): Promise<Session> => {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return { user: null, status: 'missing' };
  }

  try {
    const user = await apiFetch.get<AuthUser>('/auth/me', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
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
