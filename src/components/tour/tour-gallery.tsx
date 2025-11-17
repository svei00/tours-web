'use client';

import { useRef, useState } from 'react';

import { RichImage } from '@/components/ui/rich-image';
import type { Locale, RichImageValue } from '@/lib/sanity/types';

import styles from './tour-gallery.module.css';

/**
 * `<dialog>` nativo para el lightbox: da backdrop, foco atrapado y cierre
 * con Escape gratis del navegador, sin librería de JS — el único JS de
 * cliente real de esta página es esto y la fachada de video (HANDOFF §9).
 */
export function TourGallery({ images, locale }: { images: RichImageValue[]; locale: Locale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const openAt = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
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
            <RichImage image={images[activeIndex]} locale={locale} sizes="100vw" priority />
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
