import type { Metadata } from 'next';

import { EmptyState } from '@/components/tour/empty-state';
import { TagFilterBar } from '@/components/tour/tag-filter-bar';
import { TourGrid } from '@/components/tour/tour-grid';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getTagList, getTourList } from '@/lib/sanity/tours';
import { localeValue, type Locale } from '@/lib/sanity/types';

import styles from './page.module.css';

const SUPPORTED_LOCALES = ['es', 'en'] as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const COPY: Record<Locale, { title: string }> = {
  es: { title: 'Nuestros tours' },
  en: { title: 'Our tours' },
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: COPY[locale as Locale].title };
}

/**
 * `q` viene de SearchForm (header y drawer móvil, ver src/components/layout).
 * Sin backend de búsqueda de verdad: con el catálogo chico de este negocio
 * (HANDOFF §1, seis tours) alcanza con filtrar en memoria del lado del
 * servidor contra título y descripción corta, en el idioma actual.
 */
export default async function ToursPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  const typedLocale = locale as Locale;
  const [tours, tags] = await Promise.all([getTourList(), getTagList()]);

  const query = q?.trim().toLowerCase() ?? '';
  const visibleTours = query
    ? tours.filter((tour) => {
        const title = localeValue(tour.title, typedLocale).toLowerCase();
        const description = localeValue(tour.shortDescription, typedLocale).toLowerCase();
        return title.includes(query) || description.includes(query);
      })
    : tours;

  return (
    <Section>
      <Container>
        <div className={styles.header}>
          <h1 className="font-headline">{COPY[typedLocale].title}</h1>
          <TagFilterBar tags={tags} locale={typedLocale} />
        </div>
        {visibleTours.length === 0 ? (
          <EmptyState locale={typedLocale} query={query || undefined} />
        ) : (
          <TourGrid tours={visibleTours} locale={typedLocale} />
        )}
      </Container>
    </Section>
  );
}
