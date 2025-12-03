'use client';

import Image from 'next/image';
import { useState } from 'react';

import { trackVideoPlay } from '@/lib/analytics/events';
import { localeValue, type Locale, type VideoEmbedValue } from '@/lib/sanity/types';

import styles from './youtube-facade.module.css';

/**
 * Acepta watch?v=, youtu.be/ y shorts/ — las tres formas que YouTube
 * genera dependiendo desde dónde se copia la liga.
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [/youtube\.com\/watch\?v=([\w-]+)/, /youtu\.be\/([\w-]+)/, /youtube\.com\/shorts\/([\w-]+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fachada de clic para reproducir (HANDOFF §4): un embed crudo de YouTube
 * descarga más de un megabyte antes de que el visitante decida siquiera
 * ver algo. Aquí solo se paga ese costo si de verdad le dan clic.
 */
/** `tourName` es opcional -- VerticalVideoStrip del home reúsa videos de varios tours sin llevar el registro de a cuál pertenece cada uno (ver videos.ts), así que ahí cae al título propio del video para `video_play`. */
export function YouTubeFacade({ video, locale, tourName }: { video: VideoEmbedValue; locale: Locale; tourName?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(video.youtubeUrl);
  if (!videoId) return null;

  const title = localeValue(video.title, locale) || 'Video';
  const orientationClass = video.orientation === 'vertical' ? styles.vertical : styles.horizontal;

  if (isPlaying) {
    return (
      <div className={`${styles.wrapper} ${orientationClass}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.wrapper} ${orientationClass} ${styles.facade}`}
      onClick={() => {
        setIsPlaying(true);
        trackVideoPlay(tourName ?? title, video.orientation);
      }}
      aria-label={`${locale === 'es' ? 'Reproducir' : 'Play'}: ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={styles.thumbnail}
        unoptimized
      />
      <span className={styles.playIcon} aria-hidden="true">
        ▶
      </span>
    </button>
  );
}
