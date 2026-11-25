'use client';

import { useRef } from 'react';

import type { FitTextProps } from './FitText.types';

import { useFitLines } from '@/hooks/useFitLines';

export function FitText({ children, className }: FitTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  useFitLines(ref);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
