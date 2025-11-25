import { ComingSoon } from './coming-soon';
import type { Locale } from '@/lib/sanity/types';

const TITLE: Record<Locale, string> = { es: 'Contacto', en: 'Contact' };

/** Compartido por /contacto y /contact -- ver about-page.tsx para por qué vive aquí y no dentro de app/. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
