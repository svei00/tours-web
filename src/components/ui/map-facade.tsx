'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { trackMapOpen } from '@/lib/analytics/events';
import { buildMapsExternalUrl } from '@/lib/maps';
import type { Locale } from '@/lib/sanity/types';

import styles from './map-facade.module.css';

/**
 * `ssr: false` + solo se renderiza tras el clic (abajo, `isOpen &&`): así
 * ni el JS de Leaflet ni su CSS entran al bundle inicial -- Next los pone
 * en un chunk aparte que se pide únicamente cuando alguien de verdad pide
 * el mapa (HANDOFF §8). Mismo principio que la fachada de YouTube, ahora
 * también resuelve el peso real (~40KB) de una librería de mapas, no solo
 * el de un iframe.
 */
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading} />,
});

const COPY: Record<Locale, { openMap: string; openInGoogleMaps: string }> = {
  es: { openMap: 'Ver el mapa', openInGoogleMaps: 'Abrir en Google Maps' },
  en: { openMap: 'View the map', openInGoogleMaps: 'Open in Google Maps' },
};

type MapFacadeProps = {
  geo?: { lat: number; lng: number } | null;
  /** "Abrir en Google Maps" explícito (ej. `meetingPointMapUrl` de un tour); si falta, se arma desde `geo`. */
  externalUrl?: string | null;
  /** Dirección o punto de encuentro, solo para accesibilidad (`aria-label` del mapa) -- el texto visible ya lo pinta quien use este componente. */
  label: string;
  locale: Locale;
  location: 'contact' | 'tour';
  tourName?: string;
};

/**
 * Mapa con fachada de clic (HANDOFF §8, "El mapa — segunda revisión:
 * Leaflet + OpenStreetMap"): cero peticiones de tiles, cero JS de mapa,
 * hasta que alguien pide el mapa de verdad. Reemplaza el primer intento
 * (pegar el `<iframe>` de Google Maps) -- ese ya era keyless y sin
 * facturación, pero esto es más simple para el cliente todavía (sin pegar
 * HTML, solo tocar un mapa para ubicar el punto en Sanity) y más honesto
 * con "presupuesto cero pesos": nada que depender de Google en absoluto.
 */
export function MapFacade({ geo, externalUrl, label, locale, location, tourName }: MapFacadeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = COPY[locale];

  const resolvedExternalUrl = externalUrl ?? (geo ? buildMapsExternalUrl(geo.lat, geo.lng) : null);

  if (!geo && !resolvedExternalUrl) return null;

  return (
    <div className={styles.wrap}>
      {geo && !isOpen && (
        <button
          type="button"
          className={styles.facade}
          onClick={() => {
            setIsOpen(true);
            trackMapOpen(location, tourName);
          }}
        >
          <span className={styles.pin} aria-hidden="true">
            📍
          </span>
          <span className={styles.facadeLabel}>{copy.openMap}</span>
        </button>
      )}

      {geo && isOpen && (
        <div className={styles.mapContainer}>
          <LeafletMap lat={geo.lat} lng={geo.lng} label={label} />
        </div>
      )}

      {resolvedExternalUrl && (
        <a href={resolvedExternalUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
          {copy.openInGoogleMaps}
        </a>
      )}
    </div>
  );
}
