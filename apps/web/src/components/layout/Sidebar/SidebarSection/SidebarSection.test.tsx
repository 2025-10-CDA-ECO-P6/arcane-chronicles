import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SidebarSection } from './SidebarSection';

describe('SidebarSection', () => {
  it('is a region named by its title, with its content', () => {
    render(
      <SidebarSection id="sidebar-resume" title="Reprendre">
        <p>Contenu</p>
      </SidebarSection>,
    );

    expect(screen.getByRole('region', { name: 'Reprendre' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Reprendre' })).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});
