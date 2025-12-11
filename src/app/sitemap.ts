import type { MetadataRoute } from 'next';

import { LOCALIZED_PATHS, SITE_URL } from '@/lib/seo/metadata';
import { getLegalPrivacy, getLegalTerms } from '@/lib/sanity/legal';
import { getVisibleReviews } from '@/lib/sanity/reviews';
import { getTagList, getTourList } from '@/lib/sanity/tours';

/**
 * Un "concepto" de página siempre son DOS filas (una por locale), cada una
 * apuntando a la otra vía `alternates.languages` -- mismo hreflang
 * recíproco que `buildAlternates()` en metadata.ts, pero en formato de
 * sitemap en vez de `<head>`.
 */
function localizedEntries(esPath: string, enPath: string): MetadataRoute.Sitemap {
  const esUrl = `${SITE_URL}/es${esPath === '/' ? '' : esPath}`;
  const enUrl = `${SITE_URL}/en${enPath === '/' ? '' : enPath}`;
  const languages = { 'es-MX': esUrl, en: enUrl };

  return [
    { url: esUrl, alternates: { languages } },
    { url: enUrl, alternates: { languages } },
  ];
}

/**
 * HANDOFF §8: solo documentos no ocultos (getTourList/getTagList ya
 * filtran por `hidden != true`), los dos locales con sus alternates, y
 * /resenas excluida mientras sigue sin reseñas de verdad.
 *
 * Nosotros y Contacto ya son páginas reales (antes eran el placeholder de
 * ComingSoon) -- van sin condición. Privacidad y Términos solo entran
 * cuando su `updatedAt` está lleno, el mismo campo que saca esas páginas
 * de `noindex` (ver privacy-page.tsx/terms-page.tsx) -- un sitemap no debe
 * apuntar a una página que la propia metadata le está diciendo a Google
 * que no indexe.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, tags, reviews, legalPrivacy, legalTerms] = await Promise.all([
    getTourList(),
    getTagList(),
    getVisibleReviews(),
    getLegalPrivacy(),
    getLegalTerms(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    ...localizedEntries(LOCALIZED_PATHS.home.es, LOCALIZED_PATHS.home.en),
    ...localizedEntries(LOCALIZED_PATHS.tours.es, LOCALIZED_PATHS.tours.en),
    ...localizedEntries(LOCALIZED_PATHS.about.es, LOCALIZED_PATHS.about.en),
    ...localizedEntries(LOCALIZED_PATHS.contact.es, LOCALIZED_PATHS.contact.en),
  ];

  if (reviews.length > 0) {
    entries.push(...localizedEntries(LOCALIZED_PATHS.reviews.es, LOCALIZED_PATHS.reviews.en));
  }

  if (legalPrivacy?.updatedAt) {
    entries.push(...localizedEntries(LOCALIZED_PATHS.privacy.es, LOCALIZED_PATHS.privacy.en));
  }

  if (legalTerms?.updatedAt) {
    entries.push(...localizedEntries(LOCALIZED_PATHS.terms.es, LOCALIZED_PATHS.terms.en));
  }

  for (const tour of tours) {
    entries.push(...localizedEntries(`/tours/${tour.slugEs}`, `/tours/${tour.slugEn}`));
  }

  for (const tag of tags) {
    entries.push(
      ...localizedEntries(`${LOCALIZED_PATHS.categoryPrefix.es}/${tag.slug}`, `${LOCALIZED_PATHS.categoryPrefix.en}/${tag.slug}`),
    );
  }

  return entries;
}
