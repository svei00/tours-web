import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';

/** Lo que necesita una ReviewCard, en ReviewsBand del home y en la página completa de /resenas. */
export type ReviewItem = {
  _id: string;
  authorName: string;
  authorLocation: string | null;
  source: 'google' | 'tripadvisor' | 'facebook' | 'whatsapp' | 'directo';
  sourceUrl: string | null;
  rating: number;
  quote: string;
  language: 'es' | 'en';
  date: string | null;
};

const REVIEW_PROJECTION = groq`{
  _id,
  authorName,
  authorLocation,
  source,
  sourceUrl,
  rating,
  quote,
  language,
  date
}`;

/**
 * Solo lo que necesita el trust strip del home (HANDOFF §6): cuántas
 * reseñas visibles hay y su promedio. También decide el umbral de "menos
 * de seis reseñas visibles" que oculta /resenas del nav (HANDOFF §6) —
 * site-header.tsx la consulta para eso.
 */
export const REVIEW_STATS_QUERY = groq`{
  "count": count(*[_type == "review" && hidden != true]),
  "ratings": *[_type == "review" && hidden != true].rating
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

/** Hasta 4 reseñas con `featured == true` para ReviewsBand del home — mismo trato que FEATURED_TOUR_QUERY en tours.ts. */
export const FEATURED_REVIEWS_QUERY = groq`*[_type == "review" && hidden != true && featured == true] | order(date desc) [0...4] ${REVIEW_PROJECTION}`;

export const getFeaturedReviews = cache(async (): Promise<ReviewItem[]> => {
  return sanityClient.fetch<ReviewItem[]>(FEATURED_REVIEWS_QUERY);
});

/** Todas las reseñas visibles, para la página completa de /resenas. */
export const ALL_REVIEWS_QUERY = groq`*[_type == "review" && hidden != true] | order(date desc) ${REVIEW_PROJECTION}`;

export const getVisibleReviews = cache(async (): Promise<ReviewItem[]> => {
  return sanityClient.fetch<ReviewItem[]>(ALL_REVIEWS_QUERY);
});
