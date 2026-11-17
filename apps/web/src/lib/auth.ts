import { cookies } from 'next/headers';
import { cache } from 'react';

import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/types/auth';

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    return await apiFetch.get<AuthUser>('/auth/me', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
  } catch {
    return null;
  }
});
