import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

import { sanityClient } from './client';

const builder = createImageUrlBuilder(sanityClient);

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
