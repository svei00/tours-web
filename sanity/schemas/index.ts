import { localeBlock } from './objects/locale-block';
import { localeString } from './objects/locale-string';
import { localeText } from './objects/locale-text';
import { richImage } from './objects/rich-image';
import { videoEmbed } from './objects/video-embed';

import { brand } from './documents/brand';
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
  // documentos
  tour,
  review,
  tag,
  partner,
  promotion,
  siteSettings,
  brand,
];
