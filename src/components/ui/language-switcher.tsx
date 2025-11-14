'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './language-switcher.module.css';

const LOCALES = ['es', 'en'] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Cambia entre /es/... y /en/... preservando el resto de la ruta actual.
 * Es un intercambio de prefijo, no negociación real de idioma — next-intl
 * (con el mapa de pathnames traducidos de HANDOFF §6) llega cuando existan
 * páginas con segmentos que de verdad se traducen (/tours vs /tours en
 * inglés siguen siendo la misma palabra por ahora, así que alcanza).
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const restOfPath = pathname.replace(/^\/(es|en)/, '');

  return (
    <div className={styles.switcher} role="group" aria-label="Cambiar idioma">
      {LOCALES.map((candidate) => (
        <Link
          key={candidate}
          href={`/${candidate}${restOfPath}`}
          className={candidate === locale ? styles.active : styles.link}
          aria-current={candidate === locale ? 'true' : undefined}
        >
          {candidate.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
