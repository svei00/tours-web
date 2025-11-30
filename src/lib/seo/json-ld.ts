import { brand } from '@/config/brand';
import type { SiteSettings } from '@/lib/sanity/queries';
import { localeValue, type Locale, type TourDetail } from '@/lib/sanity/types';

import { ogImageUrl, SITE_URL } from './metadata';

/**
 * HANDOFF §8 -- solo estos tres tipos. Deliberadamente NO hay
 * Review/AggregateRating (Google restringe el marcado de reseñas propias
 * en el sitio del negocio) ni FAQPage (sin resultado enriquecido desde
 * 2023) ni SearchAction (no hay buscador real, no declarar lo que no
 * existe).
 */

type JsonLdRecord = Record<string, unknown>;

/**
 * El tipo correcto para un broker es `TravelAgency`, no `LocalBusiness`
 * genérico (HANDOFF §8) -- y tiene que coincidir carácter por carácter con
 * el Perfil de Empresa en Google una vez que exista (§16, pendiente #3).
 * Cada campo se omite solo si falta el dato en Configuración -- nunca se
 * inventa una dirección o un teléfono para "completar" el schema.
 */
export function travelAgencyJsonLd(siteSettings: SiteSettings | null): JsonLdRecord {
  const address = siteSettings?.address;
  const hasAddress = Boolean(address?.street || address?.city);

  const sameAs = [
    siteSettings?.facebookUrl,
    siteSettings?.instagramUrl,
    siteSettings?.tiktokUrl,
    siteSettings?.youtubeUrl,
    siteSettings?.googleBusinessProfileUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: brand.businessName,
    url: SITE_URL,
    ...(siteSettings?.whatsappPrimary && { telephone: `+${siteSettings.whatsappPrimary}` }),
    ...(siteSettings?.email && { email: siteSettings.email }),
    ...(hasAddress && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address?.street ?? undefined,
        addressLocality: address?.city ?? undefined,
        addressRegion: address?.state ?? undefined,
        postalCode: address?.postalCode ?? undefined,
        addressCountry: address?.country ?? undefined,
      },
    }),
    ...(address?.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: address.geo.lat,
        longitude: address.geo.lng,
      },
    }),
    ...(siteSettings?.openingHours && { openingHours: siteSettings.openingHours }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Un `TouristTrip` por tour, con `offers` cargando precio/moneda/
 * disponibilidad (HANDOFF §8). `availability: InStock` es el default
 * correcto para este negocio -- no hay control de cupo real en el
 * esquema, la disponibilidad de verdad se confirma por WhatsApp.
 */
export function touristTripJsonLd(tour: TourDetail, locale: Locale, pageUrl: string): JsonLdRecord {
  const image = ogImageUrl(tour.heroImage);

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: localeValue(tour.title, locale),
    description: localeValue(tour.shortDescription, locale),
    url: pageUrl,
    ...(image && { image }),
    ...(tour.durationHours && { duration: `PT${tour.durationHours}H` }),
    offers: {
      '@type': 'Offer',
      price: tour.priceAmount,
      priceCurrency: tour.priceCurrency,
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    },
  };
}

export function breadcrumbListJsonLd(items: { name: string; url: string }[]): JsonLdRecord {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
