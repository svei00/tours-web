import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbListJsonLd } from '@/lib/seo/json-ld';
import { buildAlternates, LOCALIZED_PATHS, SITE_URL } from '@/lib/seo/metadata';
import { getTagBySlug, getTagList, getTourListByTag } from '@/lib/sanity/tours';
import { localeValue, type Locale } from '@/lib/sanity/types';

import styles from './category-page.module.css';
import { EmptyState } from './empty-state';
import { TagFilterBar } from './tag-filter-bar';
import { TourGrid } from './tour-grid';

const BREADCRUMB_HOME: Record<Locale, string> = { es: 'Inicio', en: 'Home' };
const BREADCRUMB_TOURS: Record<Locale, string> = { es: 'Tours', en: 'Tours' };

/**
 * Implementación compartida de la página de categoría. HANDOFF §6 pide un
 * segmento de ruta distinto por idioma (/tours/categoria/ en español,
 * /tours/category/ en inglés) — este archivo vive fuera de app/ a propósito
 * (Next.js excluye del module graph los archivos con "_" adentro de app/,
 * no solo del ruteo — un intento anterior con
 * app/[locale]/tours/_category-page.tsx daba "Module not found" aunque el
 * archivo existiera). Cada carpeta de ruta real solo importa y llama esto.
 * Sin next-intl todavía, nada impide visitar /en/tours/categoria/...
 * también — es una imprecisión menor aceptada mientras tanto (NOTES.md,
 * Fase D).
 */
export type CategoryPageProps = { params: Promise<{ locale: string; tag: string }> };

export async function generateCategoryMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, tag: tagSlug } = await params;
  const tag = await getTagBySlug(tagSlug);
  if (!tag) return {};

  const typedLocale = locale as Locale;
  return {
    title: localeValue(tag.name, typedLocale),
    description: tag.description ? localeValue(tag.description, typedLocale) : undefined,
    alternates: buildAlternates(
      typedLocale,
      `${LOCALIZED_PATHS.categoryPrefix.es}/${tag.slug}`,
      `${LOCALIZED_PATHS.categoryPrefix.en}/${tag.slug}`,
    ),
  };
}

export async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, tag: tagSlug } = await params;
  const typedLocale = locale as Locale;

  const tag = await getTagBySlug(tagSlug);
  if (!tag) notFound();

  const [tours, tags] = await Promise.all([getTourListByTag(tagSlug), getTagList()]);
  const description = tag.description ? localeValue(tag.description, typedLocale) : null;
  const tagName = localeValue(tag.name, typedLocale);
  const toursListUrl = `${SITE_URL}/${typedLocale}${LOCALIZED_PATHS.tours[typedLocale]}`;

  return (
    <Section>
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: BREADCRUMB_HOME[typedLocale], url: `${SITE_URL}/${typedLocale}` },
          { name: BREADCRUMB_TOURS[typedLocale], url: toursListUrl },
          { name: tagName, url: `${SITE_URL}/${typedLocale}${LOCALIZED_PATHS.categoryPrefix[typedLocale]}/${tag.slug}` },
        ])}
      />
      <Container>
        <div className={styles.header}>
          <h1 className="font-headline">{tagName}</h1>
          {description && <p>{description}</p>}
          <TagFilterBar tags={tags} locale={typedLocale} activeSlug={tag.slug} />
        </div>
        {tours.length === 0 ? <EmptyState locale={typedLocale} /> : <TourGrid tours={tours} locale={typedLocale} />}
      </Container>
    </Section>
  );
}
