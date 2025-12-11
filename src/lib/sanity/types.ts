/**
 * Formas compartidas de lo que devuelven las consultas GROQ. El inglés
 * siempre puede venir vacío — el sitio cae de vuelta al español en el
 * momento de renderizar (HANDOFF §5, regla 2), nunca en la consulta.
 */

export type Locale = 'es' | 'en';

export type LocaleString = {
  es: string;
  en?: string | null;
};

export type LocaleText = {
  es: string;
  en?: string | null;
};

export type LocaleBlockValue = {
  es: PortableTextBlock[];
  en?: PortableTextBlock[] | null;
};

// Portable Text no tiene un tipo oficial ligero — esto es lo mínimo que
// @portabletext/react necesita para renderizar bloques de texto enriquecido.
export type PortableTextBlock = Record<string, unknown>;

export type RichImageValue = {
  asset?: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: LocaleString;
  caption?: LocaleString;
};

export type VideoEmbedValue = {
  youtubeUrl: string;
  title?: LocaleString;
  orientation: 'horizontal' | 'vertical';
  customThumbnail?: { asset?: { _ref: string } };
};

export type TagRef = {
  _id: string;
  name: LocaleString;
  slug: string;
  description?: LocaleString | null;
};

/** Lo que necesita una TourCard en /tours y en las páginas de categoría. */
export type TourListItem = {
  _id: string;
  title: LocaleString;
  slugEs: string;
  slugEn: string;
  shortDescription: LocaleText;
  heroImage: RichImageValue;
  priceAmount: number;
  priceCurrency: 'MXN' | 'USD';
  priceUnit?: LocaleString;
  durationHours: number;
  tags: TagRef[];
  featured: boolean;
};

/** Lo que necesita la página de detalle completa. */
export type TourDetail = TourListItem & {
  longDescription?: LocaleBlockValue;
  gallery: RichImageValue[];
  videos: VideoEmbedValue[];
  priceNote?: LocaleString;
  departureTimes?: string;
  meetingPoint?: LocaleString;
  meetingPointMapUrl?: string;
  includes: LocaleString[];
  excludes: LocaleString[];
  whatToBring: LocaleString[];
  minAge?: number;
  suitability?: LocaleString;
  whatsappMessage?: LocaleString;
  operator?: { name: string; showPublicly: boolean } | null;
};

export type LegalSection = {
  heading: LocaleString;
  body: LocaleBlockValue;
};

/** `updatedAt: null` es la señal de "todavía borrador" que leen /privacidad y /terminos (ver esos schemas de Sanity para el porqué). */
export type LegalPageDoc = {
  updatedAt: string | null;
  sections: LegalSection[];
};

export type AboutPageDoc = {
  lead: LocaleText | null;
  body: LocaleBlockValue | null;
};

export type ContactPageDoc = {
  intro: LocaleText | null;
};

/** Toma el español y cae de vuelta a él si el inglés está vacío (HANDOFF §5, regla 2). */
export function localeValue(value: LocaleString | LocaleText | undefined, locale: Locale): string {
  if (!value) return '';
  if (locale === 'en' && value.en) return value.en;
  return value.es;
}

/** Arma la ruta de un tour según el locale — cada idioma tiene su propio slug. */
export function tourSlugFor(tour: Pick<TourListItem, 'slugEs' | 'slugEn'>, locale: Locale): string {
  return locale === 'en' ? tour.slugEn : tour.slugEs;
}
