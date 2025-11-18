import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';

/**
 * Solo lo que necesita el trust strip del home (HANDOFF §6): cuántas
 * reseñas visibles hay y su promedio. La construcción completa de
 * ReviewsBand — tarjetas, interruptores de visibilidad en el Studio — es
 * trabajo de la Fase F; esto es una lectura mínima, mismo trato que
 * getTourList en la Fase D antes de que existiera UI de administración.
 */
export const REVIEW_STATS_QUERY = groq`{
  "count": count(*[_type == "review" && visible == true]),
  "ratings": *[_type == "review" && visible == true].rating
}`;

export type ReviewStats = {
  count: number;
  averageRating: number | null;
};

export const getReviewStats = cache(async (): Promise<ReviewStats> => {
  const result = await sanityClient.fetch<{ count: number; ratings: number[] }>(REVIEW_STATS_QUERY);
  const averageRating = result.ratings.length
    ? Math.round((result.ratings.reduce((sum, rating) => sum + rating, 0) / result.ratings.length) * 10) / 10
    : null;

  return { count: result.count, averageRating };
});
