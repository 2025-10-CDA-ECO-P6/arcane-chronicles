import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BackgroundVideo } from './BackgroundVideo';

const mediaListeners = new Map<string, () => void>();

describe('BackgroundVideo', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (media: string) => ({
      addEventListener: (_type: string, listener: () => void) =>
        mediaListeners.set(media, listener),
      removeEventListener: () => mediaListeners.delete(media),
    }));
  });

  afterEach(() => {
    mediaListeners.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('plays the fire video muted in a loop, hidden from screen readers, with the class of the page', () => {
    const { container } = render(<BackgroundVideo className="hero__video" />);
    const video = container.querySelector('video');

    expect(video).toHaveClass('hero__video');
    expect(video).toHaveAttribute('aria-hidden', 'true');
    expect(video).toHaveAttribute('poster', '/videos/fire-poster.webp');
    expect(video?.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
  });

  it('offers the portrait crop first, then the full video, each in AV1 then H.264', () => {
    const { container } = render(<BackgroundVideo />);
    const sources = [...container.querySelectorAll('source')];

    expect(sources.map((source) => source.getAttribute('src'))).toEqual([
      '/videos/fire-mobile-av1.mp4',
      '/videos/fire-mobile.mp4',
      '/videos/fire-av1.mp4',
      '/videos/fire.mp4',
    ]);
    expect(sources[0]).toHaveAttribute('type', 'video/mp4; codecs="av01.0.08M.08"');
    expect(sources[2]).toHaveAttribute('type', 'video/mp4; codecs="av01.0.08M.08"');
  });

  it('keeps the portrait crop for portrait screens and loads nothing for people who reduce motion', () => {
    const { container } = render(<BackgroundVideo />);
    const media = [...container.querySelectorAll('source')].map((source) =>
      source.getAttribute('media'),
    );

    expect(media.slice(0, 2)).toEqual(
      Array(2).fill('(prefers-reduced-motion: no-preference) and (max-aspect-ratio: 3/4)'),
    );
    expect(media.slice(2)).toEqual(Array(2).fill('(prefers-reduced-motion: no-preference)'));
  });

  it('picks its source again when the screen turns or the motion preference changes', () => {
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    const { unmount } = render(<BackgroundVideo />);

    mediaListeners.get('(prefers-reduced-motion: no-preference) and (max-aspect-ratio: 3/4)')?.();
    mediaListeners.get('(prefers-reduced-motion: no-preference)')?.();
    expect(load).toHaveBeenCalledTimes(2);

    unmount();
    expect(mediaListeners.size).toBe(0);
  });
});
