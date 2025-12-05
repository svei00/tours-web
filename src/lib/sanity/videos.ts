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
/**
 * `defined(videos)` no es decorativo: sin él, un tour sin videos aporta un
 * `null` al resultado (`.videos` de un documento sin ese campo es null, y
 * el aplanado lo conserva), la tira lo trataba como un video de verdad y
 * el home entero tronaba al leer `video.youtubeUrl`. Se descubrió al
 * hacer visible el primer tour (ver NOTES.md, Fase K).
 */
export const VERTICAL_VIDEOS_QUERY = groq`*[_type == "tour" && hidden != true && defined(videos)].videos[][orientation == "vertical"][0...8]{
  youtubeUrl,
  title,
  orientation,
  customThumbnail
}`;

/**
 * El `.filter(Boolean)` es cinturón además de tirantes: la consulta ya no
 * debería devolver nulos, pero una sección del home no puede ser capaz de
 * tumbar la página entera por un dato incompleto en el Studio.
 */
export const getVerticalVideos = cache(async (): Promise<VideoEmbedValue[]> => {
  const videos = await sanityClient.fetch<(VideoEmbedValue | null)[] | null>(VERTICAL_VIDEOS_QUERY);
  return (videos ?? []).filter((video): video is VideoEmbedValue => Boolean(video?.youtubeUrl));
});
