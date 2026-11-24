import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { KeyboardEvent } from 'react';

import { useDisclosure } from './useDisclosure';

const pressKey = (key: string) => ({ key }) as KeyboardEvent;

describe('useDisclosure', () => {
  it('starts closed and opens or closes with toggle', () => {
    const { result } = renderHook(() => useDisclosure());

    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('closes with Escape only', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.toggle());

    act(() => result.current.closeOnEscape(pressKey('Enter')));
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.closeOnEscape(pressKey('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('closes on a click outside its container', () => {
    const { result } = renderHook(() => useDisclosure());
    const container = document.createElement('div');
    document.body.append(container);
    result.current.containerRef.current = container;
    act(() => result.current.toggle());

    act(() => {
      container.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(result.current.isOpen).toBe(false);
    container.remove();
  });

  it('gives a unique id to link the button to its panel', () => {
    const first = renderHook(() => useDisclosure()).result.current.panelId;
    const second = renderHook(() => useDisclosure()).result.current.panelId;

    expect(first).not.toBe(second);
  });
});
