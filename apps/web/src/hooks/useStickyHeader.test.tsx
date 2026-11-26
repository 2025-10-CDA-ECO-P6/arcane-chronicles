import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useStickyHeader } from './useStickyHeader';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

const observers = new Map<Element, Callback>();
let onResize: () => void = () => {};

class IntersectionObserverStub {
  constructor(private callback: Callback) {}
  observe(element: Element) {
    observers.set(element, this.callback);
  }
  disconnect() {}
}

class ResizeObserverStub {
  constructor(callback: () => void) {
    onResize = callback;
  }
  observe() {}
  disconnect() {}
}

function StickyHeader() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const pageHeaderRef = useRef<HTMLElement>(null);
  const returnPointRef = useRef<HTMLDivElement>(null);
  const isSticky = useStickyHeader(placeholderRef, pageHeaderRef, returnPointRef);

  return (
    <div ref={placeholderRef} data-testid="placeholder">
      <div ref={returnPointRef} data-testid="return-point" />
      <header ref={pageHeaderRef}>{isSticky ? 'collé' : 'normal'}</header>
    </div>
  );
}

const fire = (testId: string, entry: Partial<IntersectionObserverEntry>) => {
  act(() => observers.get(screen.getByTestId(testId))?.([entry]));
};

const leaveScreen = () =>
  fire('placeholder', {
    isIntersecting: false,
    boundingClientRect: { top: -200, height: 160 } as DOMRectReadOnly,
  });

describe('useStickyHeader', () => {
  beforeEach(() => {
    observers.clear();
    vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('becomes sticky once the page header has been scrolled past', () => {
    render(<StickyHeader />);
    expect(screen.getByText('normal')).toBeInTheDocument();

    leaveScreen();

    expect(screen.getByText('collé')).toBeInTheDocument();
  });

  it('stays normal when the page header leaves the screen from the bottom', () => {
    render(<StickyHeader />);

    fire('placeholder', {
      isIntersecting: false,
      boundingClientRect: { top: 900, height: 160 } as DOMRectReadOnly,
    });

    expect(screen.getByText('normal')).toBeInTheDocument();
  });

  it('keeps the place of the page header while it is sticky', () => {
    render(<StickyHeader />);

    leaveScreen();

    expect(screen.getByTestId('placeholder').style.minBlockSize).toBe('160px');
  });

  it('goes back to normal once its place is fully visible again', () => {
    render(<StickyHeader />);
    leaveScreen();

    fire('return-point', { intersectionRatio: 0.5 });
    expect(screen.getByText('collé')).toBeInTheDocument();

    fire('return-point', { intersectionRatio: 1 });
    expect(screen.getByText('normal')).toBeInTheDocument();
  });

  it('frees the place once the page header is back to its full height', () => {
    render(<StickyHeader />);
    leaveScreen();
    fire('return-point', { intersectionRatio: 1 });
    const header = screen.getByRole('banner');
    const placeholder = screen.getByTestId('placeholder');

    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ height: 100 } as DOMRect);
    act(() => onResize());
    expect(placeholder.style.minBlockSize).toBe('160px');

    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ height: 160 } as DOMRect);
    act(() => onResize());
    expect(placeholder.style.minBlockSize).toBe('');
  });
});
