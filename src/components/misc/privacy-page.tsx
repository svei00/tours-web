import { ComingSoon } from './coming-soon';
import type { Locale } from '@/lib/sanity/types';

const TITLE: Record<Locale, string> = { es: 'Aviso de privacidad', en: 'Privacy notice' };

/** Compartido por /privacidad y /privacy -- ver about-page.tsx para por qué vive aquí y no dentro de app/. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
