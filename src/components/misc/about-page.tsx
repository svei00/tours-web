import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { Prose } from '@/components/ui/prose';
import { Section } from '@/components/ui/section';
import { buildAlternates, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getAboutPage } from '@/lib/sanity/pages';
import type { Locale } from '@/lib/sanity/types';

import styles from './about-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Nosotros', en: 'About' };

/**
 * Copy de arranque si Svei todavía no crea el documento `aboutPage` en el
 * Studio (o lo publica sin llenar un campo) -- mismo criterio que el resto
 * del sitio, nunca se muestra un hueco en blanco (HANDOFF §5, regla 2).
 */
const FALLBACK_LEAD: Record<Locale, string> = {
  es: 'No somos dueños de las lanchas. Somos quienes saben cuáles vale la pena abordar.',
  en: "We don't own the boats. We're the ones who know which ones are worth boarding.",
};

const FALLBACK_BODY: Record<Locale, string[]> = {
  es: [
    'Pura Vida Vallarta Tours nació en Puerto Vallarta con una idea simple: en una bahía llena de operadores, alguien tiene que conocerlos a todos y decir la verdad sobre cuáles valen la pena. Eso es lo que hacemos — no operamos las lanchas ni los tours nosotros mismos, los seleccionamos.',
    'Cada experiencia en este sitio pasó primero por nosotros: la probamos, hablamos con el operador, y solo la ofrecemos si de verdad se la recomendaríamos a un amigo. Esa curación es el trabajo — no vender el tour más caro, sino el que le conviene a cada quien.',
  ],
  en: [
    "Pura Vida Vallarta Tours started in Puerto Vallarta with a simple idea: in a bay full of operators, someone has to know them all and tell the truth about which ones are actually worth it. That's what we do — we don't run the boats or the tours ourselves, we select them.",
    "Every experience on this site passed through us first: we tried it, talked to the operator, and only offer it if we'd genuinely recommend it to a friend. That curation is the job — not selling the most expensive tour, but the right one for you.",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return { title: TITLE[typedLocale], alternates: buildAlternates(typedLocale, LOCALIZED_PATHS.about.es, LOCALIZED_PATHS.about.en) };
}

/** Compartido por /nosotros y /about (ver los page.tsx de esas rutas). */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const doc = await getAboutPage();

  const leadEs = doc?.lead?.es;
  const leadEn = typedLocale === 'en' && doc?.lead?.en ? doc.lead.en : leadEs;
  const lead = leadEn || FALLBACK_LEAD[typedLocale];

  const bodyBlocks = typedLocale === 'en' && doc?.body?.en ? doc.body.en : doc?.body?.es;

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE[typedLocale]}</h1>
          <p className={styles.lead}>{lead}</p>
        </header>
        <div className={styles.body}>
          {bodyBlocks && bodyBlocks.length > 0 ? (
            <Prose value={bodyBlocks} />
          ) : (
            FALLBACK_BODY[typedLocale].map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </div>
      </Container>
    </Section>
  );
}
