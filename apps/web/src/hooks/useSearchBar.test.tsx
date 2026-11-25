import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { KeyboardEvent, MouseEvent } from 'react';

import { useSearchBar } from './useSearchBar';

const click = () => ({ preventDefault: vi.fn() }) as unknown as MouseEvent<HTMLButtonElement>;
const pressKey = (key: string) => ({ key }) as KeyboardEvent;

describe('useSearchBar', () => {
  it('starts closed, and opens on the first click without submitting', () => {
    const { result } = renderHook(() => useSearchBar(false));
    const event = click();

    expect(result.current.isExpanded).toBe(false);
    act(() => result.current.openOnFirstClick(event));

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result.current.isExpanded).toBe(true);
  });

  it('lets the click submit once open', () => {
    const { result } = renderHook(() => useSearchBar(false));
    act(() => result.current.openOnFirstClick(click()));
    const event = click();

    act(() => result.current.openOnFirstClick(event));

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('stays open while a search is active', () => {
    const { result } = renderHook(() => useSearchBar(true));

    expect(result.current.isExpanded).toBe(true);
  });

  it('closes with Escape only', () => {
    const { result } = renderHook(() => useSearchBar(false));
    act(() => result.current.openOnFirstClick(click()));

    act(() => result.current.closeOnEscape(pressKey('Enter')));
    expect(result.current.isExpanded).toBe(true);

    act(() => result.current.closeOnEscape(pressKey('Escape')));
    expect(result.current.isExpanded).toBe(false);
  });
});
