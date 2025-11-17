import { localeValue, type Locale, type LocaleString, type TourDetail } from '@/lib/sanity/types';

import styles from './tour-facts.module.css';

const LABELS: Record<
  Locale,
  {
    includes: string;
    excludes: string;
    whatToBring: string;
    meetingPoint: string;
    departureTimes: string;
    minAge: string;
    mapLink: string;
  }
> = {
  es: {
    includes: 'Qué incluye',
    excludes: 'Qué no incluye',
    whatToBring: 'Qué llevar',
    meetingPoint: 'Punto de encuentro',
    departureTimes: 'Horarios de salida',
    minAge: 'Edad mínima',
    mapLink: 'Ver en Google Maps',
  },
  en: {
    includes: "What's included",
    excludes: "What's not included",
    whatToBring: 'What to bring',
    meetingPoint: 'Meeting point',
    departureTimes: 'Departure times',
    minAge: 'Minimum age',
    mapLink: 'View on Google Maps',
  },
};

function FactList({ title, items, locale }: { title: string; items: LocaleString[]; locale: Locale }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={styles.factGroup}>
      <h3 className={styles.factTitle}>{title}</h3>
      <ul className={styles.factList}>
        {items.map((item, index) => (
          <li key={index}>{localeValue(item, locale)}</li>
        ))}
      </ul>
    </div>
  );
}

/** Incluye · no incluye · qué llevar · punto de encuentro (HANDOFF §6). */
export function TourFacts({ tour, locale }: { tour: TourDetail; locale: Locale }) {
  const labels = LABELS[locale];

  return (
    <div className={styles.facts}>
      <FactList title={labels.includes} items={tour.includes} locale={locale} />
      <FactList title={labels.excludes} items={tour.excludes} locale={locale} />
      <FactList title={labels.whatToBring} items={tour.whatToBring} locale={locale} />

      <div className={styles.factGroup}>
        {tour.meetingPoint && (
          <>
            <h3 className={styles.factTitle}>{labels.meetingPoint}</h3>
            <p>{localeValue(tour.meetingPoint, locale)}</p>
            {tour.meetingPointMapUrl && (
              <a href={tour.meetingPointMapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                {labels.mapLink}
              </a>
            )}
          </>
        )}
        {tour.departureTimes && (
          <p>
            <strong>{labels.departureTimes}:</strong> {tour.departureTimes}
          </p>
        )}
        {tour.minAge != null && (
          <p>
            <strong>{labels.minAge}:</strong> {tour.minAge}+
          </p>
        )}
      </div>
    </div>
  );
}
