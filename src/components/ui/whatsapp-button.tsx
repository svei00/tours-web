import type { ReactNode } from 'react';

import { Button } from './button';

/**
 * wa.me solo acepta dígitos (con código de país, sin "+" ni espacios ni
 * guiones) — por eso se limpia el número aquí antes de armar la liga.
 * Exportada porque SiteFooter también la necesita para el teléfono en
 * texto plano (ver site-footer.tsx) — mismo criterio, un solo lugar que
 * arma la liga de wa.me en todo el sitio.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

/**
 * Formatea el número guardado (solo dígitos, ej. "523222783261") para
 * mostrarlo legible ("+52 322 278 3261"). Solo afecta el texto en pantalla
 * — buildWhatsAppUrl sigue usando el valor crudo de siteSettings para la
 * liga de wa.me.
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('52')) {
    const local = digits.slice(2);
    return `+52 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return phone;
}

type WhatsAppButtonProps = {
  phone: string | null | undefined;
  message: string;
  children: ReactNode;
  className?: string;
};

/**
 * Si no hay número configurado todavía en siteSettings, no renderiza nada
 * en vez de armar una liga rota o inventar un número — el sitio nunca
 * manda a alguien a un WhatsApp que no existe (HANDOFF §5, regla 2, misma
 * lógica que "nunca renderizar un campo en blanco").
 */
export function WhatsAppButton({ phone, message, children, className }: WhatsAppButtonProps) {
  if (!phone) return null;

  return (
    <Button href={buildWhatsAppUrl(phone, message)} variant="whatsapp" className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </Button>
  );
}
