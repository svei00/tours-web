'use client';

import { sendGAEvent } from '@next/third-parties/google';

/**
 * Los cinco eventos de HANDOFF §10 -- ninguno se dispara solo, cada uno es
 * una señal de conversión real. `track()` no hace nada (sin warning en
 * consola siquiera) si GA todavía no está inicializado -- el cliente no
 * tiene cuenta de GA4 todavía (ver `GA_MEASUREMENT_ID` en el layout raíz),
 * y estos helpers se llaman desde componentes que sí existen hoy, así que
 * no pueden asumir que `window.dataLayer` exista.
 */
function track(eventName: string, params: Record<string, string>) {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  sendGAEvent('event', eventName, params);
}

type WhatsAppClickLocation = 'header' | 'hero' | 'drawer' | 'sticky' | 'detail' | 'footer' | 'coming_soon';

export function trackWhatsAppClick(location: WhatsAppClickLocation, tourName?: string): void {
  track('whatsapp_click', { location, ...(tourName && { tour_name: tourName }) });
}

export function trackTourView(tourName: string, locale: string): void {
  track('tour_view', { tour_name: tourName, locale });
}

export function trackGalleryOpen(tourName: string): void {
  track('gallery_open', { tour_name: tourName });
}

export function trackVideoPlay(tourName: string, orientation: string): void {
  track('video_play', { tour_name: tourName, orientation });
}

type ShareNetwork = 'facebook' | 'whatsapp' | 'x' | 'email' | 'native' | 'copy' | 'instagram' | 'tiktok';

export function trackShareClick(network: ShareNetwork, tourName: string): void {
  track('share_click', { network, tour_name: tourName });
}

type MapOpenLocation = 'contact' | 'tour';

/** HANDOFF §10: sin esto no hay forma de saber si el mapa con fachada de clic (§8) se usa o no. */
export function trackMapOpen(location: MapOpenLocation, tourName?: string): void {
  track('map_open', { location, ...(tourName && { tour_name: tourName }) });
}
