import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Dot } from './Dot';

describe('Dot', () => {
  it('is hidden from screen readers', () => {
    const { container } = render(<Dot />);

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses primary by default and the requested color otherwise', () => {
    const { container, rerender } = render(<Dot />);
    expect(container.firstChild).toHaveClass('dot', 'primary');

    rerender(<Dot color="gold" className="extra" />);
    expect(container.firstChild).toHaveClass('dot', 'gold', 'extra');
  });
});
