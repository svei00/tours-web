import { LocaleLink } from '@/components/ui/locale-link';
import type { Locale } from '@/lib/sanity/types';

import styles from './empty-state.module.css';

const COPY: Record<Locale, { title: string; body: string }> = {
  es: {
    title: 'Todavía no hay tours publicados',
    body: 'Estamos preparando el catálogo. Vuelve pronto o escríbenos por WhatsApp para más información.',
  },
  en: {
    title: 'No tours published yet',
    body: "We're getting the catalog ready. Check back soon or message us on WhatsApp for more information.",
  },
};

const SEARCH_COPY: Record<Locale, { title: (query: string) => string; body: string; clear: string }> = {
  es: {
    title: (query) => `Sin resultados para "${query}"`,
    body: 'Prueba con otra palabra o revisa el catálogo completo.',
    clear: 'Ver todos los tours',
  },
  en: {
    title: (query) => `No results for "${query}"`,
    body: 'Try a different word or browse the full catalog.',
    clear: 'See all tours',
  },
};

/** `query` distingue "todavía no hay contenido" de "no hubo resultados de búsqueda" -- son estados distintos, copy distinto. */
export function EmptyState({ locale, query }: { locale: Locale; query?: string }) {
  if (query) {
    const copy = SEARCH_COPY[locale];
    return (
      <div className={styles.empty}>
        <h2 className={styles.title}>{copy.title(query)}</h2>
        <p>{copy.body}</p>
        <LocaleLink locale={locale} href="/tours" className={styles.clearLink}>
          {copy.clear}
        </LocaleLink>
      </div>
    );
  }

  const copy = COPY[locale];
  return (
    <div className={styles.empty}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p>{copy.body}</p>
    </div>
  );
}
