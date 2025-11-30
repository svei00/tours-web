import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo/metadata';

/** /studio es el CMS, no contenido público; /api es la función de traducción (HANDOFF §5), no una página. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
