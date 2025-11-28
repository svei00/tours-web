'use client';

import { useRef } from 'react';

import { WhatsAppButton } from '@/components/ui/whatsapp-button';

import { NavLinks, type NavItem } from './nav-links';
import { SearchForm } from './search-form';
import styles from './mobile-nav.module.css';

type Locale = 'es' | 'en';

const OPEN_LABEL: Record<Locale, string> = { es: 'Abrir menú', en: 'Open menu' };
const CLOSE_LABEL: Record<Locale, string> = { es: 'Cerrar menú', en: 'Close menu' };
const WHATSAPP_LABEL: Record<Locale, string> = { es: 'Reservar por WhatsApp', en: 'Book on WhatsApp' };

/**
 * El nav de escritorio (`.nav` en site-header) se esconde por completo
 * debajo de 768px sin ningún reemplazo -- bug real que reportó el
 * cliente, no una preferencia. `<dialog>` nativo otra vez (mismo patrón
 * que TourGallery): foco atrapado, cierre con Escape y clic afuera
 * gratis del navegador, sin librería.
 */
export function MobileNav({
  items,
  locale,
  whatsappPhone,
  whatsappSecondaryPhone,
  whatsappPrimaryName,
  whatsappSecondaryName,
  whatsappMessage,
}: {
  items: NavItem[];
  locale: Locale;
  whatsappPhone: string | null | undefined;
  whatsappSecondaryPhone?: string | null | undefined;
  whatsappPrimaryName?: string | null | undefined;
  whatsappSecondaryName?: string | null | undefined;
  whatsappMessage: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => dialogRef.current?.showModal()}
        aria-label={OPEN_LABEL[locale]}
      >
        <span aria-hidden="true">☰</span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => dialogRef.current?.close()}
            aria-label={CLOSE_LABEL[locale]}
          >
            ✕
          </button>
          <SearchForm locale={locale} variant="inline" onNavigate={() => dialogRef.current?.close()} />
          <NavLinks items={items} locale={locale} variant="drawer" onNavigate={() => dialogRef.current?.close()} />
          <WhatsAppButton
            phone={whatsappPhone}
            secondaryPhone={whatsappSecondaryPhone}
            primaryName={whatsappPrimaryName}
            secondaryName={whatsappSecondaryName}
            message={whatsappMessage}
            className={styles.whatsapp}
          >
            {WHATSAPP_LABEL[locale]}
          </WhatsAppButton>
        </div>
      </dialog>
    </>
  );
}
