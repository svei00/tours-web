import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { Prose } from '@/components/ui/prose';
import { Section } from '@/components/ui/section';
import { buildAlternates, draftLegalMetadata, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getLegalPrivacy } from '@/lib/sanity/legal';
import { localeValue, type Locale } from '@/lib/sanity/types';

import styles from './legal-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Aviso de privacidad', en: 'Privacy notice' };

const DISCLAIMER: Record<Locale, string> = {
  es: 'Este es un borrador. Falta que Svei o el cliente confirmen la fecha de vigencia (y cualquier campo entre corchetes dentro del texto) antes de publicar el sitio.',
  en: 'This is a draft. Svei or the client still need to confirm the effective date (and any bracketed field inside the text) before the site goes live.',
};

const NO_CONTENT: Record<Locale, string> = {
  es: 'Todavía no hay contenido cargado para esta página en el Studio.',
  en: 'No content has been loaded for this page in the Studio yet.',
};

const UPDATED_LABEL: Record<Locale, string> = { es: 'Última actualización: ', en: 'Last updated: ' };

function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', { dateStyle: 'long' }).format(new Date(`${isoDate}T00:00:00`));
}

/**
 * `updatedAt` vacío en Sanity es la señal de "todavía borrador" (ver
 * sanity/schemas/documents/legal-privacy.ts) -- mismo criterio de un solo
 * campo decisivo que `hidden` en tour/review (Fase K). Mientras esté
 * vacío: `noindex` + aviso de borrador visible. En cuanto Svei o el cliente
 * lo llenen y publiquen, la página se indexa sola, sin tocar código.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const doc = await getLegalPrivacy();
  const alternates = buildAlternates(typedLocale, LOCALIZED_PATHS.privacy.es, LOCALIZED_PATHS.privacy.en);

  if (doc?.updatedAt) return { title: TITLE[typedLocale], alternates };
  return { ...draftLegalMetadata(TITLE[typedLocale]), alternates };
}

/** Compartido por /privacidad y /privacy. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const doc = await getLegalPrivacy();

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE[typedLocale]}</h1>
          {doc?.updatedAt && (
            <p className={styles.updated}>
              {UPDATED_LABEL[typedLocale]}
              {formatDate(doc.updatedAt, typedLocale)}
            </p>
          )}
          {!doc?.updatedAt && <p className={styles.disclaimer}>{DISCLAIMER[typedLocale]}</p>}
        </header>

        {doc?.sections && doc.sections.length > 0 ? (
          <div className={styles.content}>
            {doc.sections.map((section, index) => (
              <section key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {index + 1}. {localeValue(section.heading, typedLocale)}
                </h2>
                <Prose value={typedLocale === 'en' && section.body.en ? section.body.en : section.body.es} />
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.disclaimer}>{NO_CONTENT[typedLocale]}</p>
        )}
      </Container>
    </Section>
  );
}
