import { cache } from 'react';

import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type { LocaleString, RichImageValue } from './types';

/**
 * Los campos de siteSettings que necesita el shell del sitio (header,
 * footer, barra de WhatsApp) más los del Hero del home (Fase E). Cuando
 * hagan falta más campos de siteSettings, se amplía esta misma consulta —
 * no hay que tocar este archivo para leerlo, solo agregar.
 */
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0]{
  whatsappPrimary,
  whatsappPrimaryName,
  whatsappSecondary,
  whatsappSecondaryName,
  phones,
  email,
  googleBusinessProfileUrl,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
  address,
  openingHours,
  mapEmbed,
  heroHeadline,
  heroSubheadline,
  heroSlides,
  heroScrimEnabled,
  foundedYear,
  reviewsSectionVisible,
  defaultSeo
}`;

export type SiteAddress = {
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  geo: { lat: number; lng: number } | null;
};

export type DefaultSeo = {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: RichImageValue | null;
};

export type SiteSettings = {
  whatsappPrimary: string | null;
  whatsappPrimaryName: string | null;
  whatsappSecondary: string | null;
  whatsappSecondaryName: string | null;
  phones: string[] | null;
  email: string | null;
  googleBusinessProfileUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  address: SiteAddress | null;
  openingHours: string | null;
  mapEmbed: string | null;
  heroHeadline: LocaleString | null;
  heroSubheadline: LocaleString | null;
  heroSlides: RichImageValue[] | null;
  heroScrimEnabled: boolean | null;
  foundedYear: number | null;
  reviewsSectionVisible: boolean | null;
  defaultSeo: DefaultSeo | null;
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
