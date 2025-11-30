import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ReviewCard } from '@/components/review/review-card';
import { buildAlternates, comingSoonMetadata, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getReviewStats, getVisibleReviews } from '@/lib/sanity/reviews';
import type { Locale } from '@/lib/sanity/types';

import { ComingSoon } from './coming-soon';
import styles from './reviews-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Reseñas', en: 'Reviews' };

const COPY: Record<Locale, { subtitle: (count: number) => string }> = {
  es: { subtitle: (count) => `${count} ${count === 1 ? 'reseña' : 'reseñas'} de viajeros reales` },
  en: { subtitle: (count) => `${count} ${count === 1 ? 'review' : 'reviews'} from real travelers` },
};

/**
 * Mismo criterio de las páginas ComingSoon: `noindex` solo mientras esta
 * ruta de verdad cae en ComingSoon (cero reseñas visibles). En cuanto hay
 * al menos una, el contenido es real y se indexa normal -- el umbral de
 * seis reseñas (site-header.tsx) es sobre el nav, no sobre si vale la
 * pena para SEO.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const reviews = await getVisibleReviews();

  if (reviews.length === 0) return comingSoonMetadata(TITLE[typedLocale]);

  return {
    title: TITLE[typedLocale],
    alternates: buildAlternates(typedLocale, LOCALIZED_PATHS.reviews.es, LOCALIZED_PATHS.reviews.en),
  };
}

/**
 * Compartido por /resenas y /reviews (Fase F, HANDOFF §14). Sin reseñas
 * visibles todavía cae de vuelta a ComingSoon -- mismo criterio que el
 * resto del sitio: nunca renderizar una página vacía a propósito. Con
 * menos de seis, la página igual funciona para quien llega por liga
 * directa; lo único que cambia es que el nav deja de enlazarla
 * (site-header.tsx) y no aparece en ReviewsBand del home como "ver todas".
 */
export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [reviews, stats] = await Promise.all([getVisibleReviews(), getReviewStats()]);

  if (reviews.length === 0) {
    return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
  }

  const copy = COPY[typedLocale];

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE[typedLocale]}</h1>
          <p className={styles.subtitle}>
            {stats.averageRating && (
              <>
                {stats.averageRating.toLocaleString(typedLocale === 'es' ? 'es-MX' : 'en-US')}{' '}
                <span aria-hidden="true">★</span>{' '}
              </>
            )}
            {copy.subtitle(stats.count)}
          </p>
        </header>
        <div className={styles.grid}>
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} locale={typedLocale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
