import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SearchBar } from './SearchBar';

const renderSearchBar = (params = {}) =>
  render(
    <SearchBar
      label="Rechercher une campagne"
      name="search"
      pathname="/dashboard/campaigns"
      params={params}
    />,
  );

describe('SearchBar', () => {
  it('is a search landmark with a labelled search field', () => {
    const { container } = renderSearchBar();

    expect(container.querySelector('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Rechercher une campagne' })).toHaveAttribute(
      'name',
      'search',
    );
    expect(screen.getByRole('button', { name: 'Rechercher' })).toHaveAttribute('type', 'submit');
  });

  it('sends the form to the page address', () => {
    const { container } = renderSearchBar();

    expect(container.querySelector('form')).toHaveAttribute('action', '/dashboard/campaigns');
  });

  it('shows the current search and keeps the other parameters', () => {
    const { container } = renderSearchBar({ search: 'dragon', status: 'NEW' });

    expect(screen.getByRole('searchbox')).toHaveValue('dragon');
    const hidden = container.querySelectorAll('input[type="hidden"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toHaveAttribute('name', 'status');
    expect(hidden[0]).toHaveAttribute('value', 'NEW');
  });

  it('opens the field on the first click instead of searching', () => {
    const { container } = renderSearchBar();
    const search = container.querySelector('search');

    expect(search).not.toHaveClass('search-bar--open');
    expect(fireEvent.click(screen.getByRole('button', { name: 'Rechercher' }))).toBe(false);
    expect(search).toHaveClass('search-bar--open');
    expect(screen.getByRole('searchbox')).toHaveFocus();
  });

  it('searches on click once the field is open', () => {
    const { container } = renderSearchBar();
    container.querySelector('form')?.addEventListener('submit', (event) => event.preventDefault());
    const button = screen.getByRole('button', { name: 'Rechercher' });

    fireEvent.click(button);

    expect(fireEvent.click(button)).toBe(true);
  });

  it('stays open while a search is active', () => {
    const { container } = renderSearchBar({ search: 'dragon' });

    expect(container.querySelector('search')).toHaveClass('search-bar--open');
  });

  it('closes with Escape and gives the focus back to the button', () => {
    const { container } = renderSearchBar();
    const button = screen.getByRole('button', { name: 'Rechercher' });

    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });

    expect(container.querySelector('search')).not.toHaveClass('search-bar--open');
    expect(button).toHaveFocus();
  });
});
