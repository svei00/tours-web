import type { Metadata } from 'next';

import { comingSoonMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/sanity/types';

import { ComingSoon } from './coming-soon';

const TITLE: Record<Locale, string> = { es: 'Nosotros', en: 'About' };

/** `noindex` -- todavía es el placeholder de ComingSoon, no la página real (HANDOFF §8). Quitar esto cuando /nosotros tenga contenido de verdad. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return comingSoonMetadata(TITLE[locale as Locale]);
}

/**
 * Compartido por /nosotros y /about (ver los page.tsx de esas rutas,
 * ambos re-exportan esto) -- mismo patrón que category-page.tsx en
 * Fase D: la lógica vive fuera de app/ porque Next excluye del grafo de
 * módulos cualquier archivo con "_" adentro de app/, y esto necesita
 * vivir en las dos carpetas de ruta a la vez.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
