import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { VideoEmbedValue } from './types';

/**
 * Videos verticales para la tira 9:16 del home (HANDOFF §6). No hay un
 * campo propio para esto en siteSettings -- se reúsan los videos que ya
 * viven dentro de cada tour (schemas/objects/video-embed.ts ya obliga a
 * declarar orientation), filtrando y aplanando los que son "vertical" en
 * vez de duplicar el campo en otro documento.
 */
export const VERTICAL_VIDEOS_QUERY = groq`*[_type == "tour" && visible == true].videos[orientation == "vertical"][0...8]{
  youtubeUrl,
  title,
  orientation,
  customThumbnail
}`;

export const getVerticalVideos = cache(async (): Promise<VideoEmbedValue[]> => {
  return sanityClient.fetch<VideoEmbedValue[]>(VERTICAL_VIDEOS_QUERY);
});
