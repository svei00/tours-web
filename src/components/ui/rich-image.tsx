'use client';

/**
 * `'use client'` por el `loader={sanityImageLoader}` de abajo: una función
 * no puede cruzar la frontera servidor→cliente, así que desde un Server
 * Component (TourCard, TourHero) esto tronaba con "Functions cannot be
 * passed directly to Client Components". Se marca este componente hoja —
 * no se usa `images.loaderFile` global en next.config porque ese loader
 * aplicaría también a las imágenes locales de /public, que sí queremos que
 * pase por el optimizador de Next. Ver NOTES.md, Fase K.
 */
import Image from 'next/image';

import { sanityImageLoader, urlForImage } from '@/lib/sanity/image-loader';
import { localeValue, type Locale, type RichImageValue } from '@/lib/sanity/types';

type RichImageProps = {
  image: RichImageValue | undefined;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * `fill` + un contenedor con aspect-ratio reservado es lo que mantiene el
 * CLS en 0 (HANDOFF §9) — el layout no salta cuando la foto termina de
 * cargar porque el espacio ya estaba apartado desde el primer render.
 */
export function RichImage({ image, locale, sizes, priority, className }: RichImageProps) {
  if (!image?.asset) return null;

  const src = urlForImage(image).url();
  const alt = localeValue(image.alt, locale);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loader={sanityImageLoader}
      className={className}
    />
  );
}
