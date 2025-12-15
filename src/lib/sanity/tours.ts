import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { TagRef, TourDetail, TourListItem } from './types';

/**
 * Por qué `hidden != true` y no `visible == true` en todos los filtros de
 * abajo: publicar en el Studio tiene que bastar para que algo salga en el
 * sitio. Con `visible == true` había una segunda palanca que el cliente no
 * veía, así que publicaba un tour y no aparecía nunca (ver NOTES.md, Fase
 * K). Ahora el default es mostrar y `hidden` es solo la salida de
 * emergencia para retirar algo sin despublicarlo.
 *
 * `hidden != true` es a propósito, no `hidden == false`: en GROQ un
 * documento que ni siquiera tiene el campo (todos los que ya existían
 * antes de este cambio) cumple `!= true` pero NO cumple `== false`. Esa es
 * justo la propiedad que hace que esto no necesite migrar el dataset.
 */

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
  "tags": coalesce(tags[]->{ _id, name, "slug": slug.current }, []),
  featured
}`;

export const TOUR_LIST_QUERY = groq`*[_type == "tour" && hidden != true] | order(displayOrder asc) ${TOUR_LIST_PROJECTION}`;

export const TOUR_LIST_BY_TAG_QUERY = groq`*[_type == "tour" && hidden != true && $tagSlug in tags[]->slug.current] | order(displayOrder asc) ${TOUR_LIST_PROJECTION}`;

/** Hasta 4 tours para FeaturedTours del home — dos filas de la asimetría 7/5 (HANDOFF §6). */
export const FEATURED_TOUR_QUERY = groq`*[_type == "tour" && hidden != true && featured == true] | order(displayOrder asc) [0...4] ${TOUR_LIST_PROJECTION}`;

/** Para el "nº de tours" del trust strip — cuenta, no trae los documentos. */
export const TOUR_COUNT_QUERY = groq`count(*[_type == "tour" && hidden != true])`;

export const TOUR_DETAIL_QUERY = groq`*[_type == "tour" && hidden != true && (slugEs.current == $slug || slugEn.current == $slug)][0]{
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
  meetingPointMapEmbed,
  includes,
  excludes,
  whatToBring,
  minAge,
  suitability,
  whatsappMessage,
  "slugEs": slugEs.current,
  "slugEn": slugEn.current,
  "tags": coalesce(tags[]->{ _id, name, "slug": slug.current }, []),
  "operator": operator->{ name, showPublicly },
  featured
}`;

export const TAG_LIST_QUERY = groq`*[_type == "tag" && hidden != true] | order(name.es asc) {
  _id, name, "slug": slug.current, description
}`;

export const TAG_BY_SLUG_QUERY = groq`*[_type == "tag" && slug.current == $slug && hidden != true][0]{
  _id, name, "slug": slug.current, description
}`;

/** Todos los tours visibles, para /tours. */
export const getTourList = cache(async (): Promise<TourListItem[]> => {
  return sanityClient.fetch<TourListItem[]>(TOUR_LIST_QUERY);
});

/** Los destacados del home, para FeaturedTours. */
export const getFeaturedTours = cache(async (): Promise<TourListItem[]> => {
  return sanityClient.fetch<TourListItem[]>(FEATURED_TOUR_QUERY);
});

/** El conteo del trust strip. */
export const getVisibleTourCount = cache(async (): Promise<number> => {
  return sanityClient.fetch<number>(TOUR_COUNT_QUERY);
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
