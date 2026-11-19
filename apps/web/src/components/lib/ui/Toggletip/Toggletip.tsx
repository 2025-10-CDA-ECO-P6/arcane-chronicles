'use client';

import { Button } from '@/components/lib/Button/Button';
import { useDisclosure } from '@/hooks/useDisclosure';

import styles from './Toggletip.module.scss';
import type { ToggletipProps } from './Toggletip.types';

export function Toggletip({
  label,
  icon = 'question-light',
  placement = 'bottom',
  children,
  className,
}: ToggletipProps) {
  const { isOpen, toggle, closeOnEscape, containerRef, panelId } = useDisclosure();

  return (
    <div
      ref={containerRef}
      className={[styles.toggletip, className].filter(Boolean).join(' ')}
      onKeyDown={closeOnEscape}
    >
      <Button
        color="neutral"
        icon={icon}
        iconOnly
        round
        buttonText={label}
        expanded={isOpen}
        controls={panelId}
        handleClick={toggle}
      />
      <div
        id={panelId}
        className={`${styles.toggletip__panel} ${styles[`toggletip__panel--${placement}`]}`}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}
