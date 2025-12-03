'use client';

import { useState, type FocusEvent, type ReactNode } from 'react';

import { trackWhatsAppClick } from '@/lib/analytics/events';
import { buildWhatsAppUrl, formatPhoneDisplay } from '@/lib/whatsapp';

import { Button } from './button';
import styles from './whatsapp-button.module.css';

type WhatsAppClickLocation = 'header' | 'hero' | 'drawer' | 'sticky' | 'detail' | 'footer' | 'coming_soon';

type WhatsAppButtonProps = {
  phone: string | null | undefined;
  message: string;
  children: ReactNode;
  className?: string;
  /** `whatsapp_click` (HANDOFF §10): en qué parte del sitio está este botón, y de qué tour si aplica. */
  location: WhatsAppClickLocation;
  tourName?: string;
  /** Segundo número opcional (siteSettings.whatsappSecondary) — si viene, el botón se vuelve un selector en vez de una liga directa. */
  secondaryPhone?: string | null | undefined;
  /** Nombres de quién atiende cada número (siteSettings.whatsapp{Primary,Secondary}Name), para el selector. */
  primaryName?: string | null | undefined;
  secondaryName?: string | null | undefined;
  /**
   * Hacia dónde abre el selector cuando hay dos números. `down` (default)
   * es lo normal -- funciona en el header porque hay todo el alto de la
   * página debajo. `up` es para cuando el botón vive pegado al borde
   * inferior de su contenedor: el Hero (que tiene `overflow: hidden`, así
   * que un menú hacia abajo se recorta antes de llegar a mostrar la
   * segunda opción) y las barras fijas al fondo de la pantalla
   * (StickyWhatsAppBar, StickyBookingBar) -- ahí un menú hacia abajo cae
   * directo fuera del viewport, invisible.
   */
  menuDirection?: 'up' | 'down';
};

/**
 * Si no hay número configurado todavía en siteSettings, no renderiza nada
 * en vez de armar una liga rota o inventar un número — el sitio nunca
 * manda a alguien a un WhatsApp que no existe (HANDOFF §5, regla 2, misma
 * lógica que "nunca renderizar un campo en blanco").
 *
 * Sin `secondaryPhone` se comporta igual que siempre: una sola liga a
 * wa.me. Con los dos números configurados, el botón abre un selector
 * pequeño (mismo patrón de dropdown que SearchForm variant="icon") para
 * que quien visita elija con quién escribir en vez de que el sitio decida
 * por él (feedback del cliente: nada de aleatorio/por minuto — mejor
 * dejar elegir).
 */
export function WhatsAppButton({
  phone,
  message,
  children,
  className,
  secondaryPhone,
  primaryName,
  secondaryName,
  menuDirection = 'down',
  location,
  tourName,
}: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false);

  if (!phone) return null;

  if (!secondaryPhone) {
    return (
      <Button
        href={buildWhatsAppUrl(phone, message)}
        variant="whatsapp"
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick(location, tourName)}
      >
        {children}
      </Button>
    );
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  const options = [
    { phone, name: primaryName },
    { phone: secondaryPhone, name: secondaryName },
  ];

  return (
    <div className={styles.wrap} onBlur={handleBlur}>
      <Button
        type="button"
        variant="whatsapp"
        className={className}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {children}
      </Button>
      <div
        className={[styles.menu, menuDirection === 'up' && styles.menuUp, open && styles.menuOpen].filter(Boolean).join(' ')}
        role="menu"
      >
        {options.map(({ phone: optionPhone, name }) => (
          <a
            key={optionPhone}
            role="menuitem"
            className={styles.option}
            href={buildWhatsAppUrl(optionPhone, message)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              trackWhatsAppClick(location, tourName);
              setOpen(false);
            }}
          >
            <span className={styles.optionName}>{name || formatPhoneDisplay(optionPhone)}</span>
            {name && <span className={styles.optionPhone}>{formatPhoneDisplay(optionPhone)}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
