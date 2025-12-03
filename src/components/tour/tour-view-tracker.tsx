'use client';

import { useEffect } from 'react';

import { trackTourView } from '@/lib/analytics/events';

/**
 * `tour_view` (HANDOFF §10) tiene que dispararse una vez por visita a la
 * página de detalle, no en cada re-render -- de ahí el `useEffect` con
 * dependencias y no una llamada directa en el cuerpo del componente. La
 * página en sí (tours/[slug]/page.tsx) es un Server Component y no puede
 * tocar `window`/`gtag`, así que este componente sin salida visual
 * (`return null`) es lo que hace el puente al lado del cliente.
 */
export function TourViewTracker({ tourName, locale }: { tourName: string; locale: string }) {
  useEffect(() => {
    trackTourView(tourName, locale);
  }, [tourName, locale]);

  return null;
}
