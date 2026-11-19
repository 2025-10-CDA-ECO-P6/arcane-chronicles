import type { BackgroundVideoProps } from './BackgroundVideo.types';

const VIDEO_MEDIA = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

export function BackgroundVideo({ className }: BackgroundVideoProps) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster="/videos/fire-poster.webp"
      aria-hidden="true"
    >
      <source
        src="/videos/fire-av1.mp4"
        type='video/mp4; codecs="av01.0.08M.08"'
        media={VIDEO_MEDIA}
      />
      <source src="/videos/fire.mp4" type="video/mp4" media={VIDEO_MEDIA} />
    </video>
  );
}
