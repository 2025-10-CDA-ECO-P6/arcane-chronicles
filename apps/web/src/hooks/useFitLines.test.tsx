import { render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { countFittingLines, useFitLines } from './useFitLines';

function Text() {
  const ref = useRef<HTMLParagraphElement>(null);
  useFitLines(ref);
  return (
    <p ref={ref} style={{ lineHeight: '20px' }}>
      Texte
    </p>
  );
}

describe('countFittingLines', () => {
  it('counts the whole lines that fit in the height, at least one', () => {
    expect(countFittingLines(100, 20)).toBe(5);
    expect(countFittingLines(99, 20)).toBe(4);
    expect(countFittingLines(10, 20)).toBe(1);
    expect(countFittingLines(100, 0)).toBe(1);
  });
});

describe('useFitLines', () => {
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(130);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('gives the element the number of lines that fit in its height', () => {
    const { container } = render(<Text />);

    expect(container.querySelector('p')?.style.getPropertyValue('--fit-lines')).toBe('6');
  });

  it('stops watching the size when the element goes away', () => {
    const { unmount } = render(<Text />);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
