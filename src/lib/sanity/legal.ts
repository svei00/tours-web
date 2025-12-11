import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { LegalPageDoc } from './types';

const LEGAL_PAGE_PROJECTION = groq`{
  updatedAt,
  sections[]{ heading, body }
}`;

/** `null` si Svei todavía no crea el documento en el Studio -- el mismo criterio que `getSiteSettings`, no truena. */
export const getLegalPrivacy = cache(async (): Promise<LegalPageDoc | null> => {
  return sanityClient.fetch<LegalPageDoc | null>(groq`*[_type == "legalPrivacy"][0]${LEGAL_PAGE_PROJECTION}`);
});

export const getLegalTerms = cache(async (): Promise<LegalPageDoc | null> => {
  return sanityClient.fetch<LegalPageDoc | null>(groq`*[_type == "legalTerms"][0]${LEGAL_PAGE_PROJECTION}`);
});
