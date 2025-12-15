import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { AboutPageDoc, ContactPageDoc } from './types';

/** `null` si Svei todavía no crea el documento en el Studio -- mismo criterio que `getSiteSettings`, no truena. */
export const getAboutPage = cache(async (): Promise<AboutPageDoc | null> => {
  return sanityClient.fetch<AboutPageDoc | null>(groq`*[_type == "aboutPage"][0]{ lead, body, image }`);
});

export const getContactPage = cache(async (): Promise<ContactPageDoc | null> => {
  return sanityClient.fetch<ContactPageDoc | null>(groq`*[_type == "contactPage"][0]{ intro }`);
});
