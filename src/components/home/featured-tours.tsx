import { AsymmetricRow } from '@/components/home/asymmetric-row';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { TourCard } from '@/components/tour/tour-card';
import { getFeaturedTours } from '@/lib/sanity/tours';
import type { Locale, TourListItem } from '@/lib/sanity/types';

import styles from './featured-tours.module.css';

const TITLE: Record<Locale, string> = {
  es: 'Tours destacados',
  en: 'Featured tours',
};

type Row = { variant: 'featureLeft' | 'featureRight'; tours: TourListItem[] };

/**
 * La asimetría 7/5 -> 5/7 del home (HANDOFF §6): nunca una fila de tarjetas
 * iguales. Toma hasta 4 tours con `featured == true` y los reparte en dos
 * filas de dos, invirtiendo qué lado es el ancho entre la primera y la
 * segunda. Si hay un número impar (o solo 1) el sobrante va a ancho
 * completo en vez de dejar una columna vacía. Sin tours destacados
 * todavía, la sección entera no se renderiza -- no hay nada que mostrar
 * (mismo trato que EmptyState en /tours).
 */
export async function FeaturedTours({ locale }: { locale: Locale }) {
  const tours = await getFeaturedTours();
  if (tours.length === 0) return null;

  const rows: Row[] = [];
  for (let i = 0; i < tours.length; i += 2) {
    rows.push({
      variant: rows.length % 2 === 0 ? 'featureLeft' : 'featureRight',
      tours: tours.slice(i, i + 2),
    });
  }

  return (
    <Section>
      <Container>
        <h2 className={styles.title}>{TITLE[locale]}</h2>
        <div className={styles.rows}>
          {rows.map((row, index) =>
            row.tours.length === 2 ? (
              <AsymmetricRow
                key={index}
                variant={row.variant}
                wide={<TourCard tour={row.tours[0]} locale={locale} />}
                narrow={<TourCard tour={row.tours[1]} locale={locale} />}
              />
            ) : (
              <div key={index} className={styles.single}>
                <TourCard tour={row.tours[0]} locale={locale} />
              </div>
            ),
          )}
        </div>
      </Container>
    </Section>
  );
}
