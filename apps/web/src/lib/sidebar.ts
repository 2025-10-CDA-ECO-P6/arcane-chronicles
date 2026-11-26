export const SIDEBAR_COOKIE = 'sidebar';

export const isSidebarOpenFromCookie = (value?: string) => value !== 'closed';

export const sidebarCookie = (isOpen: boolean) =>
  `${SIDEBAR_COOKIE}=${isOpen ? 'open' : 'closed'}; path=/; max-age=31536000; samesite=lax`;
