import { type NextRequest, NextResponse } from 'next/server';

const GM_ROUTES = ['/dashboard'];
const GUEST_ONLY_ROUTES = ['/login', '/register'];
const DEFAULT_GM_ROUTE = '/dashboard/campaigns';

const matchesRoute = (path: string, routes: string[]) =>
  routes.some((route) => path === route || path.startsWith(`${route}/`));

const hasValidToken = (token?: string) => {
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = hasValidToken(token);

  if (matchesRoute(pathname, GM_ROUTES) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.nextUrl);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesRoute(pathname, GUEST_ONLY_ROUTES) && isAuthenticated) {
    return NextResponse.redirect(new URL(DEFAULT_GM_ROUTE, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|videos|favicon.ico|.*\\.(?:png|jpg|webp|svg|mp4)$).*)',
  ],
};
