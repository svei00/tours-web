import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';

/**
 * Los campos de siteSettings que necesita el shell del sitio (header,
 * footer, barra de WhatsApp). Cuando Fase D/E necesiten heroSlides,
 * heroHeadline, etc., se amplía esta misma consulta o se agrega una nueva
 * a su lado — no hay que tocar este archivo para leerlo, solo agregar.
 */
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  whatsappPrimary,
  whatsappSecondary,
  phones,
  email,
  googleBusinessProfileUrl,
  facebookUrl,
  instagramUrl,
  tiktokUrl
}`;

export type SiteSettings = {
  whatsappPrimary: string | null;
  whatsappSecondary: string | null;
  phones: string[] | null;
  email: string | null;
  googleBusinessProfileUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
};

/**
 * `siteSettings` es un singleton que Svei todavía no ha llenado en el
 * Studio — devuelve `null` en ese caso en vez de lanzar, para que el
 * header/footer puedan decidir qué mostrar mientras tanto (ver
 * WhatsAppButton, que cae a un número de reserva si esto es null).
 *
 * `cache()` evita que se dispare la misma consulta dos veces cuando el
 * header y el footer la piden por separado en el mismo render.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return sanityClient.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY);
});
