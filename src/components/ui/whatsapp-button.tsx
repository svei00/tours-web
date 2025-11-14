import type { ReactNode } from 'react';

import { Button } from './button';

/**
 * wa.me solo acepta dígitos (con código de país, sin "+" ni espacios ni
 * guiones) — por eso se limpia el número aquí antes de armar la liga.
 */
function buildWhatsAppUrl(phone: string, message: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
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
