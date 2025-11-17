import { Badge } from '@/components/ui/badge';
import { LocaleLink } from '@/components/ui/locale-link';
import { RichImage } from '@/components/ui/rich-image';
import { localeValue, tourSlugFor, type Locale, type TourListItem } from '@/lib/sanity/types';

import styles from './tour-card.module.css';

function formatPrice(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TourCard({ tour, locale }: { tour: TourListItem; locale: Locale }) {
  const slug = tourSlugFor(tour, locale);
  const title = localeValue(tour.title, locale);
  const description = localeValue(tour.shortDescription, locale);
  const priceUnit = tour.priceUnit ? localeValue(tour.priceUnit, locale) : '';

  return (
    <LocaleLink locale={locale} href={`/tours/${slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <RichImage
          image={tour.heroImage}
          locale={locale}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <div className={styles.body}>
        {tour.tags.length > 0 && (
          <div className={styles.tags}>
            {tour.tags.map((tag) => (
              <Badge key={tag._id} variant="muted">
                {localeValue(tag.name, locale)}
              </Badge>
            ))}
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            {formatPrice(tour.priceAmount, tour.priceCurrency, locale)}
            {priceUnit && <span className={styles.priceUnit}> {priceUnit}</span>}
          </span>
          <span className={styles.duration}>{tour.durationHours}h</span>
        </div>
      </div>
    </LocaleLink>
  );
}
