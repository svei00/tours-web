import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { Prose } from '@/components/ui/prose';
import { Section } from '@/components/ui/section';
import { buildAlternates, draftLegalMetadata, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getLegalTerms } from '@/lib/sanity/legal';
import { localeValue, type Locale } from '@/lib/sanity/types';

import styles from './legal-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Términos y condiciones', en: 'Terms and conditions' };

const DISCLAIMER: Record<Locale, string> = {
  es: 'Este es un borrador. Falta que Svei o el cliente confirmen la fecha de vigencia antes de publicar el sitio.',
  en: 'This is a draft. Svei or the client still need to confirm the effective date before the site goes live.',
};

const NO_CONTENT: Record<Locale, string> = {
  es: 'Todavía no hay contenido cargado para esta página en el Studio.',
  en: 'No content has been loaded for this page in the Studio yet.',
};

const UPDATED_LABEL: Record<Locale, string> = { es: 'Última actualización: ', en: 'Last updated: ' };

function formatDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', { dateStyle: 'long' }).format(new Date(`${isoDate}T00:00:00`));
}

/** Mismo criterio que privacy-page.tsx -- ver ese archivo para el porqué de `updatedAt` como interruptor de noindex. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const doc = await getLegalTerms();
  const alternates = buildAlternates(typedLocale, LOCALIZED_PATHS.terms.es, LOCALIZED_PATHS.terms.en);

  if (doc?.updatedAt) return { title: TITLE[typedLocale], alternates };
  return { ...draftLegalMetadata(TITLE[typedLocale]), alternates };
}

/** Compartido por /terminos y /terms. */
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const doc = await getLegalTerms();

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
