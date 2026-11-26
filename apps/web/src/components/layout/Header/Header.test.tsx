import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from './Header';

vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }));
const location = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({ usePathname: () => location.pathname }));
const sidebar = vi.hoisted(() => ({ isOpen: true, toggle: vi.fn() }));

vi.mock('@/context/ArcaneContext', () => ({
  useArcane: () => ({
    currentUser: null,
    isAuthenticated: false,
    handleUser: vi.fn(),
    isSidebarOpen: sidebar.isOpen,
    toggleSidebar: sidebar.toggle,
  }),
}));

const scrollTo = (position: number) =>
  act(() => {
    window.scrollY = position;
    fireEvent.scroll(window);
  });

const HEADER_HEIGHT = 80;

describe('Header', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(HEADER_HEIGHT);
  });

  afterEach(() => {
    window.scrollY = 0;
    location.pathname = '/';
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('marks itself as scrolled a little past its own height and stays so until the very top', () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    scrollTo(HEADER_HEIGHT + 32);
    expect(header).not.toHaveClass('header--scrolled');

    scrollTo(HEADER_HEIGHT + 33);
    expect(header).toHaveClass('header--scrolled');

    scrollTo(HEADER_HEIGHT / 2);
    expect(header).toHaveClass('header--scrolled');

    scrollTo(0);
    expect(header).not.toHaveClass('header--scrolled');
  });

  it('keeps its intro until the first scroll and never gets it back', () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    expect(header).toHaveClass('header--intro');

    scrollTo(200);
    expect(header).not.toHaveClass('header--intro');

    scrollTo(0);
    expect(header).not.toHaveClass('header--intro');
  });

  it('shows the menu button only in the GM space', () => {
    location.pathname = '/';
    render(<Header />);

    expect(screen.queryByRole('button', { name: /menu/ })).not.toBeInTheDocument();
  });

  it('opens or closes the sidebar with the menu button', () => {
    location.pathname = '/dashboard/campaigns';
    sidebar.isOpen = true;
    render(<Header />);

    fireEvent.click(screen.getByRole('button', { name: 'Fermer le menu' }));

    expect(sidebar.toggle).toHaveBeenCalledTimes(1);
  });

  it('tells screen readers whether the sidebar is open and which element it controls', () => {
    location.pathname = '/dashboard/campaigns';
    sidebar.isOpen = true;
    const { unmount } = render(<Header />);
    const openButton = screen.getByRole('button', { name: 'Fermer le menu' });
    expect(openButton).toHaveAttribute('aria-expanded', 'true');
    expect(openButton).toHaveAttribute('aria-controls', 'gm-sidebar');
    unmount();

    sidebar.isOpen = false;
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
