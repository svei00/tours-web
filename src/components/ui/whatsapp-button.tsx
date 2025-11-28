'use client';

import { useState, type FocusEvent, type ReactNode } from 'react';

import { buildWhatsAppUrl, formatPhoneDisplay } from '@/lib/whatsapp';

import { Button } from './button';
import styles from './whatsapp-button.module.css';

type WhatsAppButtonProps = {
  phone: string | null | undefined;
  message: string;
  children: ReactNode;
  className?: string;
  /** Segundo número opcional (siteSettings.whatsappSecondary) — si viene, el botón se vuelve un selector en vez de una liga directa. */
  secondaryPhone?: string | null | undefined;
  /** Nombres de quién atiende cada número (siteSettings.whatsapp{Primary,Secondary}Name), para el selector. */
  primaryName?: string | null | undefined;
  secondaryName?: string | null | undefined;
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
}: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false);

  if (!phone) return null;

  if (!secondaryPhone) {
    return (
      <Button href={buildWhatsAppUrl(phone, message)} variant="whatsapp" className={className} target="_blank" rel="noopener noreferrer">
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
      <div className={open ? `${styles.menu} ${styles.menuOpen}` : styles.menu} role="menu">
        {options.map(({ phone: optionPhone, name }) => (
          <a
            key={optionPhone}
            role="menuitem"
            className={styles.option}
            href={buildWhatsAppUrl(optionPhone, message)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <span className={styles.optionName}>{name || formatPhoneDisplay(optionPhone)}</span>
            {name && <span className={styles.optionPhone}>{formatPhoneDisplay(optionPhone)}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
