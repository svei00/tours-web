/**
 * Helpers puros de WhatsApp, separados de whatsapp-button.tsx a propósito:
 * ese componente es 'use client' (necesita estado para el selector de dos
 * números), y una función exportada desde un módulo cliente no se puede
 * invocar desde un Server Component (SiteFooter la necesita para armar el
 * href sin volverse cliente también). Vivir aquí las deja llamables desde
 * cualquier lado.
 */

/** wa.me solo acepta dígitos (con código de país, sin "+" ni espacios ni guiones). */
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
