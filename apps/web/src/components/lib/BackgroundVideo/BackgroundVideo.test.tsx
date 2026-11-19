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

  it('offers the AV1 video first and the H.264 one as a fallback', () => {
    const { container } = render(<BackgroundVideo />);
    const sources = [...container.querySelectorAll('source')];

    expect(sources.map((source) => source.getAttribute('src'))).toEqual([
      '/videos/fire-av1.mp4',
      '/videos/fire.mp4',
    ]);
    expect(sources[0]).toHaveAttribute('type', 'video/mp4; codecs="av01.0.08M.08"');
  });

  it('only loads the video on large screens for people who accept motion', () => {
    const { container } = render(<BackgroundVideo />);

    for (const source of container.querySelectorAll('source')) {
      expect(source).toHaveAttribute(
        'media',
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      );
    }
  });
});
