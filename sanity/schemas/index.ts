import { legalSection } from './objects/legal-section';
import { localeBlock } from './objects/locale-block';
import { localeString } from './objects/locale-string';
import { localeText } from './objects/locale-text';
import { richImage } from './objects/rich-image';
import { videoEmbed } from './objects/video-embed';

import { aboutPage } from './documents/about-page';
import { brand } from './documents/brand';
import { contactPage } from './documents/contact-page';
import { legalPrivacy } from './documents/legal-privacy';
import { legalTerms } from './documents/legal-terms';
import { partner } from './documents/partner';
import { promotion } from './documents/promotion';
import { review } from './documents/review';
import { siteSettings } from './documents/site-settings';
import { tag } from './documents/tag';
import { tour } from './documents/tour';

export const schemaTypes = [
  // objetos reutilizables primero — los documentos dependen de ellos
  localeString,
  localeText,
  localeBlock,
  richImage,
  videoEmbed,
  legalSection,
  // documentos
  tour,
  review,
  tag,
  partner,
  promotion,
  siteSettings,
  aboutPage,
  contactPage,
  legalPrivacy,
  legalTerms,
  brand,
];
