import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getTagBySlug, getTagList, getTourListByTag } from '@/lib/sanity/tours';
import { localeValue, type Locale } from '@/lib/sanity/types';

import styles from './category-page.module.css';
import { EmptyState } from './empty-state';
import { TagFilterBar } from './tag-filter-bar';
import { TourGrid } from './tour-grid';

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
  return { title: localeValue(tag.name, locale as Locale) };
}

export async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, tag: tagSlug } = await params;
  const typedLocale = locale as Locale;

  const tag = await getTagBySlug(tagSlug);
  if (!tag) notFound();

  const [tours, tags] = await Promise.all([getTourListByTag(tagSlug), getTagList()]);
  const description = tag.description ? localeValue(tag.description, typedLocale) : null;

  return (
    <Section>
      <Container>
        <div className={styles.header}>
          <h1 className="font-headline">{localeValue(tag.name, typedLocale)}</h1>
          {description && <p>{description}</p>}
          <TagFilterBar tags={tags} locale={typedLocale} activeSlug={tag.slug} />
        </div>
        {tours.length === 0 ? <EmptyState locale={typedLocale} /> : <TourGrid tours={tours} locale={typedLocale} />}
      </Container>
    </Section>
  );
}
