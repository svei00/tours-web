import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { TagRef, TourDetail, TourListItem } from './types';

/** Proyección compartida — lo que necesita una TourCard, en el listado y en las páginas de categoría. */
const TOUR_LIST_PROJECTION = groq`{
  _id,
  title,
  "slugEs": slugEs.current,
  "slugEn": slugEn.current,
  shortDescription,
  heroImage,
  priceAmount,
  priceCurrency,
  priceUnit,
  durationHours,
  "tags": tags[]->{ _id, name, "slug": slug.current },
  featured
}`;

export const TOUR_LIST_QUERY = groq`*[_type == "tour" && visible == true] | order(displayOrder asc) ${TOUR_LIST_PROJECTION}`;

export const TOUR_LIST_BY_TAG_QUERY = groq`*[_type == "tour" && visible == true && $tagSlug in tags[]->slug.current] | order(displayOrder asc) ${TOUR_LIST_PROJECTION}`;

export const TOUR_DETAIL_QUERY = groq`*[_type == "tour" && visible == true && (slugEs.current == $slug || slugEn.current == $slug)][0]{
  _id,
  title,
  shortDescription,
  longDescription,
  heroImage,
  gallery,
  videos,
  priceAmount,
  priceCurrency,
  priceUnit,
  priceNote,
  durationHours,
  departureTimes,
  meetingPoint,
  meetingPointMapUrl,
  includes,
  excludes,
  whatToBring,
  minAge,
  suitability,
  whatsappMessage,
  "slugEs": slugEs.current,
  "slugEn": slugEn.current,
  "tags": tags[]->{ _id, name, "slug": slug.current },
  "operator": operator->{ name, showPublicly },
  featured
}`;

export const TAG_LIST_QUERY = groq`*[_type == "tag" && visible == true] | order(name.es asc) {
  _id, name, "slug": slug.current, description
}`;

export const TAG_BY_SLUG_QUERY = groq`*[_type == "tag" && slug.current == $slug && visible == true][0]{
  _id, name, "slug": slug.current, description
}`;

/** Todos los tours visibles, para /tours. */
export const getTourList = cache(async (): Promise<TourListItem[]> => {
  return sanityClient.fetch<TourListItem[]>(TOUR_LIST_QUERY);
});

/** Tours visibles con esta categoría, para /tours/categoria/[tag]. */
export const getTourListByTag = cache(async (tagSlug: string): Promise<TourListItem[]> => {
  return sanityClient.fetch<TourListItem[]>(TOUR_LIST_BY_TAG_QUERY, { tagSlug });
});

/**
 * Un tour por slug — recibe el slug tal como viene de la URL, que puede
 * ser el de cualquiera de los dos idiomas (`slugEs` o `slugEn`); la
 * consulta prueba los dos. `null` si no existe o no está visible.
 */
export const getTourBySlug = cache(async (slug: string): Promise<TourDetail | null> => {
  return sanityClient.fetch<TourDetail | null>(TOUR_DETAIL_QUERY, { slug });
});

export const getTagList = cache(async (): Promise<TagRef[]> => {
  return sanityClient.fetch<TagRef[]>(TAG_LIST_QUERY);
});

export const getTagBySlug = cache(async (slug: string): Promise<TagRef | null> => {
  return sanityClient.fetch<TagRef | null>(TAG_BY_SLUG_QUERY, { slug });
});
