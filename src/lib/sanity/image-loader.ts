import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

/**
 * Config plana, NO el `sanityClient` completo de `./client.ts` -- a
 * `createImageUrlBuilder` le basta con `{ projectId, dataset }`
 * (`@sanity/image-url` lo acepta como `SanityProjectDetails`, ver sus
 * tipos). Esto importa porque `rich-image.tsx` (el único consumidor de
 * este archivo) es `'use client'`: si se importara `sanityClient`, todo
 * `next-sanity`/`@sanity/client` -- el cliente de lectura Y escritura
 * completo -- se colaba al bundle del navegador solo para construir URLs
 * de imagen. Con esta config plana, `next-sanity` deja de tener CUALQUIER
 * ruta de import hacia código de cliente, y se queda del lado del
 * servidor (donde sí se necesita para las consultas GROQ reales). Ver
 * next.config.ts, que documentaba este bulto como "problema de
 * arquitectura" antes de este arreglo.
 */
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
});

/** Construye la URL base a partir de un asset de Sanity, respetando el hotspot. */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Loader personalizado de next/image (HANDOFF §9): el CDN de Sanity hace
 * el trabajo pesado de recorte/formato/calidad vía parámetros de URL
 * (`auto=format` sirve AVIF o WebP solo, sin paso de build), así que
 * next/image no necesita re-optimizar nada — solo pedirle el ancho que
 * hace falta en cada momento.
 */
export function sanityImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }): string {
  return `${src}?w=${width}&auto=format&q=${quality ?? 75}&fit=max`;
}
