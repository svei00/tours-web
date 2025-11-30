import type { Metadata } from 'next';

import { comingSoonMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/sanity/types';

import { ComingSoon } from './coming-soon';

const TITLE: Record<Locale, string> = { es: 'Contacto', en: 'Contact' };

/** `noindex` -- todavía es el placeholder de ComingSoon (HANDOFF §8). Quitar cuando /contacto tenga contenido de verdad. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return comingSoonMetadata(TITLE[locale as Locale]);
}

/** Compartido por /contacto y /contact -- ver about-page.tsx para por qué vive aquí y no dentro de app/. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
