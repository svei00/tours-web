import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { LocaleString, LocaleText } from './types';

/** Lo que necesita PromoBanner del home (HANDOFF §6). */
export type PromotionItem = {
  _id: string;
  title: LocaleString;
  description: LocaleText | null;
  badgeText: LocaleString | null;
  endDate: string;
  appliesTo: Array<{ slugEs: string; slugEn: string }>;
};

/**
 * `endDate >= $today` es el auto-ocultamiento que promotion.ts (el
 * esquema) delega al frontend (ver el comentario ahí): la fecha siempre
 * existe porque el campo es obligatorio, esta consulta es lo único que
 * de verdad la compara contra hoy. `startDate` es opcional, así que una
 * promo sin fecha de inicio ya cuenta como activa.
 */
export const ACTIVE_PROMOTIONS_QUERY = groq`*[
  _type == "promotion" &&
  visible == true &&
  endDate >= $today &&
  (!defined(startDate) || startDate <= $today)
] | order(endDate asc) {
  _id,
  title,
  description,
  badgeText,
  endDate,
  "appliesTo": appliesTo[]->{ "slugEs": slugEs.current, "slugEn": slugEn.current }
}`;

export const getActivePromotions = cache(async (): Promise<PromotionItem[]> => {
  const today = new Date().toISOString().slice(0, 10);
  return sanityClient.fetch<PromotionItem[]>(ACTIVE_PROMOTIONS_QUERY, { today });
});
