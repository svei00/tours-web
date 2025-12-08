import type { Locale, TourListItem } from '@/lib/sanity/types';

import styles from './tour-grid.module.css';
import { TourCard } from './tour-card';

/**
 * Retícula uniforme a propósito: a diferencia del home (HANDOFF §6,
 * asimetría 7/5), un catálogo que se está comparando necesita tarjetas
 * consistentes — la regla "nunca tres tarjetas iguales" es para no verse
 * genérico en secciones editoriales, no para un listado tipo catálogo.
 */
export function TourGrid({ tours, locale }: { tours: TourListItem[]; locale: Locale }) {
  return (
    <div className={styles.grid}>
      {tours.map((tour, index) => (
        <TourCard key={tour._id} tour={tour} locale={locale} priority={index === 0} />
      ))}
    </div>
  );
}
