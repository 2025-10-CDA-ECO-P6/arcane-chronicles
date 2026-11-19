import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from './Header';

vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/context/ArcaneContext', () => ({
  useArcane: () => ({ currentUser: null, isAuthenticated: false, handleUser: vi.fn() }),
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
});
