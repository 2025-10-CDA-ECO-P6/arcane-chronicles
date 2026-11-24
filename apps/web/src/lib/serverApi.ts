import { cookies } from 'next/headers';

import { apiFetch } from '@/lib/api';

export const getSessionToken = async () => (await cookies()).get('token')?.value;

export const serverGet = async <T>(path: string): Promise<T> => {
  const token = await getSessionToken();

  return apiFetch.get<T>(path, {
    headers: token ? { Cookie: `token=${token}` } : undefined,
    cache: 'no-store',
  });
};
