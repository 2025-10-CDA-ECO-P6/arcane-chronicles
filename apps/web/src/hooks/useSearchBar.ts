import { flushSync } from 'react-dom';

import type { KeyboardEvent, MouseEvent } from 'react';

import { useDisclosure } from '@/hooks/useDisclosure';

export function useSearchBar(hasSearch: boolean) {
  const { isOpen, toggle, close, containerRef } = useDisclosure<HTMLElement>();
  const isExpanded = isOpen || hasSearch;

  const openOnFirstClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isExpanded) {
      event.preventDefault();
      flushSync(toggle);
      containerRef.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    }
  };

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      close();
      containerRef.current?.querySelector('button')?.focus();
    }
  };

  return { isExpanded, containerRef, openOnFirstClick, closeOnEscape };
}
