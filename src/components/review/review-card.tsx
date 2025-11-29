import type { Locale } from '@/lib/sanity/types';
import type { ReviewItem } from '@/lib/sanity/reviews';

import styles from './review-card.module.css';

const SOURCE_LABEL: Record<ReviewItem['source'], Record<Locale, string>> = {
  google: { es: 'Google', en: 'Google' },
  tripadvisor: { es: 'TripAdvisor', en: 'TripAdvisor' },
  facebook: { es: 'Facebook', en: 'Facebook' },
  whatsapp: { es: 'WhatsApp', en: 'WhatsApp' },
  directo: { es: 'Directo', en: 'Direct' },
};

/** ★ llenas hasta `rating`, vacías el resto -- sin librería de íconos, mismo criterio que el resto del sitio. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * `lang` en el blockquote usa `review.language`, NO el locale del sitio
 * (HANDOFF §5: las reseñas no se traducen, y el idioma mezclado es en sí
 * mismo una señal de confianza). La etiqueta de fuente sí sigue el
 * locale de la página.
 */
export function ReviewCard({ review, locale }: { review: ReviewItem; locale: Locale }) {
  const sourceLabel = SOURCE_LABEL[review.source][locale];

  return (
    <figure className={styles.card}>
      <Stars rating={review.rating} />
      <blockquote className={styles.quote} lang={review.language}>
        “{review.quote}”
      </blockquote>
      <figcaption className={styles.footer}>
        <span className={styles.author}>{review.authorName}</span>
        {review.authorLocation && <span className={styles.location}>{review.authorLocation}</span>}
        {review.sourceUrl ? (
          <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.source}>
            {sourceLabel}
          </a>
        ) : (
          <span className={styles.source}>{sourceLabel}</span>
        )}
      </figcaption>
    </figure>
  );
}
