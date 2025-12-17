/**
 * Helpers puros del mapa (HANDOFF §8, "El mapa — segunda revisión: Leaflet
 * + OpenStreetMap"). Separados de `map-facade.tsx` a propósito, mismo
 * criterio que `whatsapp.ts`: son funciones sin estado, útiles desde
 * cualquier lado sin arrastrar `'use client'`.
 */

/** La liga de "Abrir en Google Maps" — la gente sí quiere direcciones paso a paso, y eso Leaflet no lo da. En celular abre la app nativa. */
export function buildMapsExternalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
