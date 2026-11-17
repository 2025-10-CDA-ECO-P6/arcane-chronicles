'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavLinkProps } from './NavLink.types';

export function NavLink({ href, children, className, exact = href === '/' }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={className ? `link link--no-underline ${className}` : 'link link--no-underline'}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
