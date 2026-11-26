import { type RefObject, useEffect, useState } from 'react';

const readHeaderHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;

export function useStickyHeader(
  placeholderRef: RefObject<HTMLElement | null>,
  pageHeaderRef: RefObject<HTMLElement | null>,
  returnPointRef: RefObject<HTMLElement | null>,
) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    const pageHeader = pageHeaderRef.current;
    const returnPoint = returnPointRef.current;
    if (!placeholder || !pageHeader || !returnPoint) {
      return undefined;
    }

    let isStuck = false;
    let fullHeight = 0;

    const resizeObserver = new ResizeObserver(() => {
      const pageHeaderHeight = pageHeader.getBoundingClientRect().height;
      placeholder.style.setProperty('--page-header-width', `${placeholder.clientWidth}px`);
      if (isStuck) {
        placeholder.style.setProperty('--page-header-sticky-height', `${pageHeaderHeight}px`);
      } else if (pageHeaderHeight >= fullHeight) {
        placeholder.style.minBlockSize = '';
      }
    });

    const headerHeight = readHeaderHeight();
    const belowHeader = { rootMargin: `-${headerHeight}px 0px 0px 0px` };
    const placeholderObserver = new IntersectionObserver(([entry]) => {
      if (!isStuck && !entry.isIntersecting && entry.boundingClientRect.top < headerHeight) {
        isStuck = true;
        fullHeight = entry.boundingClientRect.height;
        placeholder.style.minBlockSize = `${fullHeight}px`;
        setIsSticky(true);
      }
    }, belowHeader);
    const returnPointObserver = new IntersectionObserver(
      ([entry]) => {
        if (isStuck && entry.intersectionRatio === 1) {
          isStuck = false;
          setIsSticky(false);
        }
      },
      { ...belowHeader, threshold: 1 },
    );

    resizeObserver.observe(placeholder);
    resizeObserver.observe(pageHeader);
    placeholderObserver.observe(placeholder);
    returnPointObserver.observe(returnPoint);

    return () => {
      resizeObserver.disconnect();
      placeholderObserver.disconnect();
      returnPointObserver.disconnect();
    };
  }, [placeholderRef, pageHeaderRef, returnPointRef]);

  return isSticky;
}
