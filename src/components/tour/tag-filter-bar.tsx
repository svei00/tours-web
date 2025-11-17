import { LocaleLink } from '@/components/ui/locale-link';
import { localeValue, type Locale, type TagRef } from '@/lib/sanity/types';

import styles from './tag-filter-bar.module.css';

/**
 * Segmento distinto por idioma (HANDOFF §6: /tours/categoria/ en español,
 * /tours/category/ en inglés) — cada tag es su propia URL indexable, no un
 * filtro por query string, porque eso es lo que le da valor de SEO local
 * ("tours en lancha Puerto Vallarta").
 */
const CATEGORY_SEGMENT: Record<Locale, string> = { es: 'tours/categoria', en: 'tours/category' };

const ALL_LABEL: Record<Locale, string> = { es: 'Todos', en: 'All' };

export function TagFilterBar({ tags, locale, activeSlug }: { tags: TagRef[]; locale: Locale; activeSlug?: string }) {
  if (tags.length === 0) return null;

  return (
    <nav className={styles.bar} aria-label={locale === 'es' ? 'Filtrar por categoría' : 'Filter by category'}>
      <LocaleLink locale={locale} href="/tours" className={!activeSlug ? styles.active : styles.link}>
        {ALL_LABEL[locale]}
      </LocaleLink>
      {tags.map((tag) => (
        <LocaleLink
          key={tag._id}
          locale={locale}
          href={`/${CATEGORY_SEGMENT[locale]}/${tag.slug}`}
          className={tag.slug === activeSlug ? styles.active : styles.link}
        >
          {localeValue(tag.name, locale)}
        </LocaleLink>
      ))}
    </nav>
  );
}
