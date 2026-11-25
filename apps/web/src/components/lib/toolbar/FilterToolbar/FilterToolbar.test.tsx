import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FilterToolbar } from './FilterToolbar';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const options = [
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminée' },
];

const renderToolbar = (params = {}) =>
  render(
    <FilterToolbar
      label="Filtrer par statut"
      name="status"
      options={options}
      pathname="/dashboard/campaigns"
      params={params}
    />,
  );

describe('FilterToolbar', () => {
  it('shows the count of each option on its badge and in the select', () => {
    render(
      <FilterToolbar
        label="Filtrer par statut"
        name="status"
        options={[{ value: 'IN_PROGRESS', label: 'En cours', count: 2 }]}
        allCount={5}
        pathname="/dashboard/campaigns"
        params={{}}
      />,
    );

    expect(screen.getByRole('link', { name: 'Toutes 5' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'En cours 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'En cours (2)' })).toBeInTheDocument();
  });

  it('links each option to the address filtered on its value', () => {
    renderToolbar();

    expect(screen.getByRole('navigation', { name: 'Filtrer par statut' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Toutes' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns',
    );
    expect(screen.getByRole('link', { name: 'En cours' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns?status=IN_PROGRESS',
    );
  });

  it('marks "Toutes" as active without a known filter', () => {
    renderToolbar({ status: 'UNKNOWN' });

    expect(screen.getByRole('link', { name: 'Toutes' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'En cours' })).not.toHaveAttribute('aria-current');
  });

  it('marks the active option and keeps the other parameters', () => {
    renderToolbar({ status: 'COMPLETED', search: 'dragon' });

    expect(screen.getByRole('link', { name: 'Terminée' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'En cours' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns?status=IN_PROGRESS&search=dragon',
    );
    expect(screen.getByRole('link', { name: 'Toutes' })).toHaveAttribute(
      'href',
      '/dashboard/campaigns?search=dragon',
    );
  });
});
