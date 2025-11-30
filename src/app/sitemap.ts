import type { MetadataRoute } from 'next';

import { LOCALIZED_PATHS, SITE_URL } from '@/lib/seo/metadata';
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
 * HANDOFF §8: solo documentos con `visible: true` (getTourList/getTagList
 * ya filtran por eso), los dos locales con sus alternates, y /resenas
 * excluida mientras sigue sin reseñas de verdad. Nosotros/Contacto/
 * Privacidad/Términos se quedan FUERA a propósito -- siguen siendo el
 * placeholder de ComingSoon (mismo `noindex` que sus generateMetadata en
 * src/components/misc/), y un sitemap no debe apuntar a una página que la
 * propia metadata le está diciendo a Google que no indexe.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, tags, reviews] = await Promise.all([getTourList(), getTagList(), getVisibleReviews()]);

  const entries: MetadataRoute.Sitemap = [
    ...localizedEntries(LOCALIZED_PATHS.home.es, LOCALIZED_PATHS.home.en),
    ...localizedEntries(LOCALIZED_PATHS.tours.es, LOCALIZED_PATHS.tours.en),
  ];

  if (reviews.length > 0) {
    entries.push(...localizedEntries(LOCALIZED_PATHS.reviews.es, LOCALIZED_PATHS.reviews.en));
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
