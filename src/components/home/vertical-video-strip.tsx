import { YouTubeFacade } from '@/components/ui/youtube-facade';
import { getVerticalVideos } from '@/lib/sanity/videos';
import type { Locale } from '@/lib/sanity/types';

import styles from './vertical-video-strip.module.css';

const HEADING: Record<Locale, string> = {
  es: 'Míralo antes de ir',
  en: 'See it before you go',
};

/**
 * Tira de video vertical 9:16 que se sale del contenedor por la derecha
 * (HANDOFF §6). Sin videos verticales todavía en ningún tour, la sección
 * no se renderiza -- nada que mostrar (mismo trato que FeaturedTours).
 */
export async function VerticalVideoStrip({ locale }: { locale: Locale }) {
  const videos = await getVerticalVideos();
  if (videos.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{HEADING[locale]}</h2>
      <div className={styles.bleedWrapper}>
        <div className={styles.row}>
          {videos.map((video, index) => (
            <div key={index} className={styles.card}>
              <YouTubeFacade video={video} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
