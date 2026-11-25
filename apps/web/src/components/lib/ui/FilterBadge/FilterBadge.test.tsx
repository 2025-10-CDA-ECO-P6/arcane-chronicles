import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FilterBadge } from './FilterBadge';

describe('FilterBadge', () => {
  it('is a link to the filtered address', () => {
    render(<FilterBadge label="En cours" href="/dashboard/campaigns?status=IN_PROGRESS" />);

    expect(screen.getByRole('link', { name: 'En cours' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns?status=IN_PROGRESS',
    );
  });

  it('marks the active filter for screen readers and styles', () => {
    render(<FilterBadge label="En cours" href="/dashboard/campaigns" isActive />);

    const link = screen.getByRole('link', { name: 'En cours' });
    expect(link).toHaveAttribute('aria-current', 'true');
    expect(link).toHaveClass('filter-badge--active');
  });

  it('is not marked when inactive', () => {
    render(<FilterBadge label="Terminée" href="/dashboard/campaigns" />);

    const link = screen.getByRole('link', { name: 'Terminée' });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('filter-badge--active');
  });
});
