import { Container } from '@/components/ui/container';
import { getReviewStats } from '@/lib/sanity/reviews';
import { getSiteSettings } from '@/lib/sanity/queries';
import { getVisibleTourCount } from '@/lib/sanity/tours';
import type { Locale } from '@/lib/sanity/types';

import styles from './trust-strip.module.css';

const GBP_LABEL: Record<Locale, string> = {
  es: 'Ver en Google',
  en: 'View on Google',
};

function yearsLabel(years: number, locale: Locale): string {
  if (locale === 'en') return `${years} ${years === 1 ? 'year' : 'years'} running`;
  return `${years} ${years === 1 ? 'año operando' : 'años operando'}`;
}

function tourCountLabel(count: number, locale: Locale): string {
  if (locale === 'en') return `${count} curated ${count === 1 ? 'tour' : 'tours'}`;
  return `${count} ${count === 1 ? 'tour curado' : 'tours curados'}`;
}

function reviewsLabel(count: number, averageRating: number | null, locale: Locale): string {
  const ratingPart = averageRating ? `${averageRating.toLocaleString(locale === 'es' ? 'es-MX' : 'en-US')} ★ ` : '';
  if (locale === 'en') return `${ratingPart}${count} ${count === 1 ? 'review' : 'reviews'}`;
  return `${ratingPart}${count} ${count === 1 ? 'reseña' : 'reseñas'}`;
}

/**
 * Años operando · nº de tours · reseñas · liga a Google (HANDOFF §6).
 * Cada estadística se oculta sola si no hay dato todavía (foundedYear sin
 * llenar, cero tours destacados, cero reseñas) — mismo principio que
 * WhatsAppButton: nunca inventar un número para no dejar un hueco visual.
 * Si no queda ninguna, la tira entera no se renderiza.
 */
export async function TrustStrip({ locale }: { locale: Locale }) {
  const [siteSettings, tourCount, reviewStats] = await Promise.all([
    getSiteSettings(),
    getVisibleTourCount(),
    getReviewStats(),
  ]);

  const currentYear = new Date().getFullYear();
  const years = siteSettings?.foundedYear ? currentYear - siteSettings.foundedYear : null;

  const stats: string[] = [];
  if (years && years > 0) stats.push(yearsLabel(years, locale));
  if (tourCount > 0) stats.push(tourCountLabel(tourCount, locale));
  if (reviewStats.count > 0) stats.push(reviewsLabel(reviewStats.count, reviewStats.averageRating, locale));

  const gbpUrl = siteSettings?.googleBusinessProfileUrl;

  if (stats.length === 0 && !gbpUrl) return null;

  return (
    <div className={styles.strip}>
      <Container>
        <div className={styles.row}>
          {stats.map((stat) => (
            <span key={stat} className={styles.stat}>
              {stat}
            </span>
          ))}
          {gbpUrl && (
            <a href={gbpUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {GBP_LABEL[locale]}
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
