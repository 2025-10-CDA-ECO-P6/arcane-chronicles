import { type NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login', request.nextUrl);
  const redirectTo = request.nextUrl.searchParams.get('redirect');

  if (redirectTo) {
    loginUrl.searchParams.set('redirect', redirectTo);
  }

  const response = NextResponse.redirect(loginUrl);

  try {
    const logout = await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', cache: 'no-store' });
    logout.headers
      .getSetCookie()
      .forEach((cookie) => response.headers.append('Set-Cookie', cookie));
  } catch {
    response.cookies.delete('token');
  }

  return response;
}
