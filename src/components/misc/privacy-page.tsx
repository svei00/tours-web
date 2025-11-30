import type { Metadata } from 'next';

import { comingSoonMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/sanity/types';

import { ComingSoon } from './coming-soon';

const TITLE: Record<Locale, string> = { es: 'Aviso de privacidad', en: 'Privacy notice' };

/**
 * `noindex` -- todavía es el placeholder de ComingSoon, NO el aviso de
 * privacidad real (HANDOFF §11 y §16, pendiente #4: el texto legal
 * vinculante tiene que venir de Svei o del cliente). Indexar este
 * placeholder como si fuera el aviso final sería peor que no tenerlo.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return comingSoonMetadata(TITLE[locale as Locale]);
}

/** Compartido por /privacidad y /privacy -- ver about-page.tsx para por qué vive aquí y no dentro de app/. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
