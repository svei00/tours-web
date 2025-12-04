import type { Metadata } from 'next';

import { urlForImage } from '@/lib/sanity/image-loader';
import type { Locale, RichImageValue } from '@/lib/sanity/types';

/**
 * Todavía no hay dominio comprado (HANDOFF §16, pendiente #del cliente) --
 * `NEXT_PUBLIC_SITE_URL` es lo que Svei tiene que dar de alta en Vercel el
 * día que exista uno. Mientras tanto cae a la URL de preview de Vercel
 * (`VERCEL_URL`, que Vercel llena solo en cada deploy) y por último a
 * localhost -- así sitemap/JSON-LD/OG nunca truenan por falta de dominio,
 * solo apuntan a donde sea que el sitio esté corriendo ahora mismo.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

/**
 * Los segmentos de ruta se traducen (HANDOFF §6), así que un mismo
 * "concepto" de página tiene una ruta distinta por idioma. Esto es la
 * fuente de verdad para armar hreflang recíproco sin repetir las rutas a
 * mano en cada `generateMetadata` -- si un segmento cambia, cambia aquí
 * una sola vez.
 */
export const LOCALIZED_PATHS = {
  home: { es: '/', en: '/' },
  tours: { es: '/tours', en: '/tours' },
  about: { es: '/nosotros', en: '/about' },
  contact: { es: '/contacto', en: '/contact' },
  reviews: { es: '/resenas', en: '/reviews' },
  privacy: { es: '/privacidad', en: '/privacy' },
  terms: { es: '/terminos', en: '/terms' },
  categoryPrefix: { es: '/tours/categoria', en: '/tours/category' },
} as const;

/**
 * hreflang recíproco (HANDOFF §8): cada página tiene que declarar la
 * versión en el otro idioma Y a sí misma, o Google descarta el conjunto
 * completo -- es el error más común en un sitio bilingüe. `esPath`/
 * `enPath` ya vienen resueltos (con el slug o el tag que corresponda) para
 * que esta función no necesite saber nada de tours ni categorías.
 */
export function buildAlternates(locale: Locale, esPath: string, enPath: string): Metadata['alternates'] {
  const esUrl = `${SITE_URL}/es${esPath === '/' ? '' : esPath}`;
  const enUrl = `${SITE_URL}/en${enPath === '/' ? '' : enPath}`;

  return {
    canonical: locale === 'en' ? enUrl : esUrl,
    languages: {
      'es-MX': esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  };
}

/**
 * Para /nosotros, /contacto, /resenas (sin reseñas todavía), /privacidad,
 * /terminos mientras siguen cayendo en ComingSoon (ver esos componentes en
 * src/components/misc/): título real para la pestaña del navegador, pero
 * `noindex` para que Google no indexe un placeholder de "todavía estamos
 * armando esta sección" como si fuera la página final. `follow: true`
 * porque los links que salen de ahí (WhatsApp, volver al inicio) sí deben
 * poder rastrearse con normalidad.
 */
export function comingSoonMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
  };
}

/**
 * Mismo `noindex, follow` que `comingSoonMetadata`, pero para una razón
 * distinta: /privacidad y /terminos (Fase I) ya tienen contenido real, no
 * son el placeholder de ComingSoon -- lo que falta es que Svei o el
 * cliente llenen los datos entre corchetes que el borrador de HANDOFF §15.5
 * deja pendientes (razón social, domicilio fiscal, fecha de vigencia).
 * Indexar un aviso de privacidad con placeholders visibles sería peor que
 * no indexarlo. Nombre separado a propósito -- ver el comentario de
 * `comingSoonMetadata` para el caso que sí es "no hay nada que mostrar".
 */
export function draftLegalMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: true },
  };
}

/** 1200×630 (HANDOFF §8) -- el tamaño estándar que Facebook/WhatsApp/Twitter esperan para no recortar la imagen al compartir. */
export function ogImageUrl(image: RichImageValue | undefined): string | undefined {
  if (!image?.asset) return undefined;
  return urlForImage(image).width(1200).height(630).fit('crop').url();
}
