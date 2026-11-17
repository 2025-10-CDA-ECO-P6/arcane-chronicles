import type { BackgroundVideoProps } from './BackgroundVideo.types';

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
        src="/videos/fire.mp4"
        type="video/mp4"
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
      />
    </video>
  );
}
