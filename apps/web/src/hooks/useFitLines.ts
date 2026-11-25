import { type RefObject, useEffect } from 'react';

export const countFittingLines = (height: number, lineHeight: number) =>
  lineHeight > 0 ? Math.max(1, Math.floor(height / lineHeight)) : 1;

export function useFitLines(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const update = () => {
      const style = getComputedStyle(element);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
      const lines = countFittingLines(element.clientHeight, lineHeight);
      element.style.setProperty('--fit-lines', String(lines));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}
