import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BackgroundVideo } from './BackgroundVideo';

describe('BackgroundVideo', () => {
  it('plays the fire video muted in a loop, hidden from screen readers, with the class of the page', () => {
    const { container } = render(<BackgroundVideo className="hero__video" />);
    const video = container.querySelector('video');

    expect(video).toHaveClass('hero__video');
    expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(video).toHaveAttribute('poster', '/videos/fire-poster.webp');
    expect(video?.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
  });

  it('only loads the video on large screens for people who accept motion', () => {
    const { container } = render(<BackgroundVideo />);

    expect(container.querySelector('source')).toHaveAttribute(
      'media',
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
    );
  });
});
