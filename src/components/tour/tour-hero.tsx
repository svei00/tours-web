import { RichImage } from '@/components/ui/rich-image';
import { localeValue, type Locale, type TourDetail } from '@/lib/sanity/types';

import styles from './tour-hero.module.css';

function formatPrice(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** A sangre, título, precio, duración (HANDOFF §6). */
export function TourHero({ tour, locale }: { tour: TourDetail; locale: Locale }) {
  const priceUnit = tour.priceUnit ? localeValue(tour.priceUnit, locale) : '';

  return (
    <div className={styles.hero}>
      <div className={styles.imageWrapper}>
        <RichImage image={tour.heroImage} locale={locale} sizes="100vw" priority />
      </div>
      <div className={styles.overlay}>
        <h1 className={styles.title}>{localeValue(tour.title, locale)}</h1>
        <div className={styles.meta}>
          <span className={styles.price}>
            {formatPrice(tour.priceAmount, tour.priceCurrency, locale)}
            {priceUnit && <span className={styles.priceUnit}> {priceUnit}</span>}
          </span>
          <span className={styles.duration}>{tour.durationHours}h</span>
        </div>
      </div>
    </div>
  );
}
