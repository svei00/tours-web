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

export function EmptyState({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  return (
    <div className={styles.empty}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p>{copy.body}</p>
    </div>
  );
}
