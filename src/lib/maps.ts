/**
 * Helpers puros del mapa con fachada de clic (HANDOFF §8, "El mapa —
 * decisión revisada"). Separados de `map-facade.tsx` a propósito, mismo
 * criterio que `whatsapp.ts`: son funciones sin estado, útiles desde
 * cualquier lado sin arrastrar `'use client'`.
 */

const ALLOWED_EMBED_PREFIX = 'https://www.google.com/maps/embed';

/**
 * El cliente pega el `<iframe>` completo que Google Maps genera en
 * "Compartir → Insertar un mapa → Copiar HTML". Esta función extrae el
 * `src` con una expresión regular y **valida el prefijo** — el sitio
 * nunca renderiza el HTML pegado tal cual, solo esta URL ya verificada.
 * Cualquier otra cosa que alguien pegue por error (un embed de otro
 * servicio, texto suelto) devuelve `null` en vez de colarse al DOM.
 */
export function extractGoogleMapsEmbedSrc(pastedHtml: string | null | undefined): string | null {
  if (!pastedHtml) return null;
  const match = pastedHtml.match(/src=["']([^"']+)["']/);
  const src = match?.[1];
  if (!src || !src.startsWith(ALLOWED_EMBED_PREFIX)) return null;
  return src;
}

/**
 * Respaldo cuando no hay `embedHtml` pero sí hay coordenadas
 * (`siteSettings.address.geo`, ya obligatorias para el schema de
 * TravelAgency). `output=embed` es keyless igual que la ruta de
 * "Insertar un mapa", pero **no está documentada oficialmente por
 * Google** a diferencia de esa — si algún día deja de cargar, la
 * solución es llenar el campo del embed explícito, no perseguir un bug
 * en este código (ver HANDOFF §8).
 */
export function buildMapsEmbedFromGeo(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

/** La liga de "Abrir en Google Maps" cuando no hay una explícita — abre la app nativa en celular. */
export function buildMapsExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
