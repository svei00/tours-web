import { ComingSoon } from './coming-soon';
import type { Locale } from '@/lib/sanity/types';

const TITLE: Record<Locale, string> = { es: 'Reseñas', en: 'Reviews' };

/**
 * Compartido por /resenas y /reviews -- ver about-page.tsx para por qué
 * vive aquí y no dentro de app/. Esta es la más provisional de las tres:
 * cuando exista Fase F (reseñas y promociones, HANDOFF §14) esto se
 * reemplaza por la página real, que además debe esconderse sola del nav
 * y del sitemap con menos de seis reseñas visibles (HANDOFF §6) -- eso
 * todavía no está hecho, el nav de site-header.tsx sigue enlazando aquí
 * siempre.
 */
export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return <ComingSoon locale={typedLocale} title={TITLE[typedLocale]} />;
}
