'use client';

import { useEffect, useRef } from 'react';

import type { BackgroundVideoProps } from './BackgroundVideo.types';

const MOTION_MEDIA = '(prefers-reduced-motion: no-preference)';
const PORTRAIT_MEDIA = `${MOTION_MEDIA} and (max-aspect-ratio: 3/4)`;
const AV1_TYPE = 'video/mp4; codecs="av01.0.08M.08"';

export function BackgroundVideo({ className }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const queries = [PORTRAIT_MEDIA, MOTION_MEDIA].map((media) => window.matchMedia(media));
    const reloadSource = () => videoRef.current?.load();

    queries.forEach((query) => query.addEventListener('change', reloadSource));
    return () => queries.forEach((query) => query.removeEventListener('change', reloadSource));
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      poster="/videos/fire-poster.webp"
      aria-hidden="true"
    >
      <source src="/videos/fire-mobile-av1.mp4" type={AV1_TYPE} media={PORTRAIT_MEDIA} />
      <source src="/videos/fire-mobile.mp4" type="video/mp4" media={PORTRAIT_MEDIA} />
      <source src="/videos/fire-av1.mp4" type={AV1_TYPE} media={MOTION_MEDIA} />
      <source src="/videos/fire.mp4" type="video/mp4" media={MOTION_MEDIA} />
    </video>
  );
}
