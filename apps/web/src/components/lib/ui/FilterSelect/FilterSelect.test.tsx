import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FilterSelect } from './FilterSelect';

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

const push = vi.fn();

const options = [
  { value: 'IN_PROGRESS', label: 'En cours', count: 1 },
  { value: 'COMPLETED', label: 'Terminée', count: 2 },
];

const renderSelect = (params = {}) =>
  render(
    <FilterSelect
      label="Filtrer par statut"
      name="status"
      options={options}
      pathname="/dashboard/campaigns"
      params={params}
      allLabel="Toutes"
      allCount={3}
    />,
  );

describe('FilterSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  });

  it('lists every option with its count', () => {
    renderSelect();

    expect(screen.getByRole('combobox', { name: 'Filtrer par statut' })).toHaveValue('');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Toutes (3)',
      'En cours (1)',
      'Terminée (2)',
    ]);
  });

  it('selects the active filter', () => {
    renderSelect({ status: 'COMPLETED' });
    expect(screen.getByRole('combobox')).toHaveValue('COMPLETED');
  });

  it('ignores an unknown filter', () => {
    renderSelect({ status: 'UNKNOWN' });
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('goes to the filtered address and keeps the other parameters', () => {
    renderSelect({ search: 'dragon' });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'IN_PROGRESS' } });

    expect(push).toHaveBeenCalledWith('/dashboard/campaigns?search=dragon&status=IN_PROGRESS', {
      scroll: false,
    });
  });

  it('removes the filter when "Toutes" is chosen', () => {
    renderSelect({ status: 'COMPLETED', search: 'dragon' });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });

    expect(push).toHaveBeenCalledWith('/dashboard/campaigns?search=dragon', { scroll: false });
  });
});
