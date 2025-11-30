import type { Metadata } from 'next';

import { comingSoonMetadata } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/sanity/types';

import { ComingSoon } from './coming-soon';

const TITLE: Record<Locale, string> = { es: 'Términos y condiciones', en: 'Terms and conditions' };

/** `noindex` -- todavía es el placeholder de ComingSoon, no los términos reales (HANDOFF §11 y §16). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return comingSoonMetadata(TITLE[locale as Locale]);
}

/** Compartido por /terminos y /terms -- ver about-page.tsx para por qué vive aquí y no dentro de app/. */
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
