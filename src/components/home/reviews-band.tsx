import { Container } from '@/components/ui/container';
import { LocaleLink } from '@/components/ui/locale-link';
import { Section } from '@/components/ui/section';
import { ReviewCard } from '@/components/review/review-card';
import { getFeaturedReviews, getReviewStats } from '@/lib/sanity/reviews';
import { getSiteSettings } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';

import styles from './reviews-band.module.css';

const COPY: Record<Locale, { title: string; viewAll: string; reviewsWord: (count: number) => string }> = {
  es: {
    title: 'Lo que dicen nuestros viajeros',
    viewAll: 'Ver todas las reseñas →',
    reviewsWord: (count) => (count === 1 ? 'reseña' : 'reseñas'),
  },
  en: {
    title: 'What our travelers say',
    viewAll: 'See all reviews →',
    reviewsWord: (count) => (count === 1 ? 'review' : 'reviews'),
  },
};

const REVIEWS_HREF: Record<Locale, string> = { es: '/resenas', en: '/reviews' };

/**
 * 4/8 (HANDOFF §6): columna angosta con el promedio y la liga a "ver
 * todas", columna ancha con las reseñas destacadas. Doble interruptor de
 * ocultamiento -- si `reviewsSectionVisible` está apagado en Configuración
 * O no hay ninguna reseña marcada como destacada todavía, la sección
 * entera no se renderiza (mismo trato que FeaturedTours en Fase E).
 *
 * La liga "ver todas" solo aparece con 6+ reseñas visibles -- por debajo
 * de eso /resenas se oculta sola del nav (HANDOFF §6, ver site-header.tsx),
 * así que no tiene sentido enlazarla desde aquí tampoco.
 */
export async function ReviewsBand({ locale }: { locale: Locale }) {
  const [siteSettings, reviews, stats] = await Promise.all([
    getSiteSettings(),
    getFeaturedReviews(),
    getReviewStats(),
  ]);

  if (siteSettings?.reviewsSectionVisible === false) return null;
  if (reviews.length === 0) return null;

  const copy = COPY[locale];

  return (
    <Section>
      <Container>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <h2 className={styles.title}>{copy.title}</h2>
            {stats.averageRating && (
              <p className={styles.average}>
                {stats.averageRating.toLocaleString(locale === 'es' ? 'es-MX' : 'en-US')}
                <span className={styles.star} aria-hidden="true">
                  ★
                </span>
              </p>
            )}
            {stats.count > 0 && (
              <p className={styles.count}>
                {stats.count} {copy.reviewsWord(stats.count)}
              </p>
            )}
            {stats.count >= 6 && (
              <LocaleLink locale={locale} href={REVIEWS_HREF[locale]} className={styles.viewAll}>
                {copy.viewAll}
              </LocaleLink>
            )}
          </div>
          <div className={styles.cards}>
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} locale={locale} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
