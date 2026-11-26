import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PageHeader } from './PageHeader';

class ObserverStub {
  observe() {}
  disconnect() {}
}

describe('PageHeader', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', ObserverStub);
    vi.stubGlobal('ResizeObserver', ObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the title as the heading of the page', () => {
    render(<PageHeader title="Mes campagnes" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Mes campagnes' })).toBeInTheDocument();
  });

  it('places the actions and the content given by the page', () => {
    render(
      <PageHeader title="Mes campagnes" actions={<button type="button">Nouvelle campagne</button>}>
        <input aria-label="Rechercher une campagne" />
      </PageHeader>,
    );

    expect(screen.getByRole('button', { name: 'Nouvelle campagne' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Rechercher une campagne' })).toBeInTheDocument();
  });

  it('leaves out the actions block when the page has no action', () => {
    const { container } = render(<PageHeader title="Personnages" />);

    expect(container.querySelector('.page-header__actions')).not.toBeInTheDocument();
  });

  it('gives its own image to the background, or leaves the default one', () => {
    const banner = { src: '/campagnes.webp', width: 1600, height: 400 };
    const { container, rerender } = render(<PageHeader title="Mes campagnes" image={banner} />);
    const header = () => container.querySelector('header');

    expect(header()?.style.getPropertyValue('--page-header-image')).toBe('url("/campagnes.webp")');

    rerender(<PageHeader title="L’archipel du néant" image="/images/demo/archipel.webp" />);
    expect(header()?.style.getPropertyValue('--page-header-image')).toBe(
      'url("/images/demo/archipel.webp")',
    );

    rerender(<PageHeader title="Personnages" />);
    expect(header()?.style.getPropertyValue('--page-header-image')).toBe('');
  });
});
