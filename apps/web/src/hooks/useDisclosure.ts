import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

export function useDisclosure<T extends HTMLElement = HTMLDivElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<T>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const toggle = () => setIsOpen((open) => !open);

  const close = () => setIsOpen(false);

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  return { isOpen, toggle, close, closeOnEscape, containerRef, panelId };
}
