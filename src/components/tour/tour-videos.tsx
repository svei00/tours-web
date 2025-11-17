import { YouTubeFacade } from '@/components/ui/youtube-facade';
import type { Locale, VideoEmbedValue } from '@/lib/sanity/types';

import styles from './tour-videos.module.css';

export function TourVideos({ videos, locale }: { videos: VideoEmbedValue[]; locale: Locale }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className={styles.videos}>
      {videos.map((video, index) => (
        <YouTubeFacade key={index} video={video} locale={locale} />
      ))}
    </div>
  );
}
