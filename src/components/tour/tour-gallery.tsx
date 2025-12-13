'use client';

import { useRef, useState } from 'react';

import { RichImage } from '@/components/ui/rich-image';
import { trackGalleryOpen } from '@/lib/analytics/events';
import type { Locale, RichImageValue } from '@/lib/sanity/types';

import styles from './tour-gallery.module.css';

/**
 * `<dialog>` nativo para el lightbox: da backdrop, foco atrapado y cierre
 * con Escape gratis del navegador, sin librería de JS — el único JS de
 * cliente real de esta página es esto y la fachada de video (HANDOFF §9).
 */
export function TourGallery({ images, locale, tourName }: { images: RichImageValue[]; locale: Locale; tourName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const openAt = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
    trackGalleryOpen(tourName);
  };

  const goTo = (delta: number) => {
    setActiveIndex((current) => (current + delta + images.length) % images.length);
  };

  return (
    <div>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <button key={index} type="button" className={styles.thumbButton} onClick={() => openAt(index)}>
            <RichImage image={image} locale={locale} sizes="(max-width: 768px) 50vw, 25vw" />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className={styles.dialogContent}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => dialogRef.current?.close()}
            aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
          >
            ✕
          </button>
          <button
            type="button"
            className={styles.navButton}
            style={{ left: 0 }}
            onClick={() => goTo(-1)}
            aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
          >
            ‹
          </button>
          <div className={styles.imageStage}>
            {/*
              Sin `priority` a propósito (HANDOFF §9 -- LCP del detalle de
              tour venía saliendo apenas arriba del presupuesto de 2.0s):
              este `<dialog>` empieza cerrado (`display: none` de fábrica,
              no hay `open`), pero `priority` en next/image inyecta un
              `<link rel="preload">` en el <head> en el momento del render
              sin importar si el elemento se ve o no -- así que la imagen
              de `images[0]` se precargaba a la misma prioridad que el
              hero de verdad (TourHero) en cada visita, peleándole ancho de
              banda aunque el lightbox nunca se llegara a abrir. Sin
              `priority`, el `loading="lazy"` de default de next/image no
              dispara la carga mientras el `<dialog>` sigue oculto.
            */}
            <RichImage image={images[activeIndex]} locale={locale} sizes="100vw" />
          </div>
          <button
            type="button"
            className={styles.navButton}
            style={{ right: 0 }}
            onClick={() => goTo(1)}
            aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
          >
            ›
          </button>
        </div>
      </dialog>
    </div>
  );
}
