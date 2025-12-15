'use client';

import { useState } from 'react';

import { trackMapOpen } from '@/lib/analytics/events';
import { buildMapsEmbedFromGeo, buildMapsExternalUrl, extractGoogleMapsEmbedSrc } from '@/lib/maps';
import type { Locale } from '@/lib/sanity/types';

import styles from './map-facade.module.css';

const COPY: Record<Locale, { openMap: string; openInGoogleMaps: string }> = {
  es: { openMap: 'Ver el mapa', openInGoogleMaps: 'Abrir en Google Maps' },
  en: { openMap: 'View the map', openInGoogleMaps: 'Open in Google Maps' },
};

type MapFacadeProps = {
  /** El `<iframe>` completo que el cliente pegó desde "Insertar un mapa" -- se valida el `src`, nunca se renderiza el HTML pegado. */
  embedHtml?: string | null;
  /** Respaldo cuando no hay `embedHtml` -- ver HANDOFF §8. */
  geo?: { lat: number; lng: number } | null;
  /** "Abrir en Google Maps" explícito (ej. `meetingPointMapUrl` de un tour); si falta, se arma desde `geo`. */
  externalUrl?: string | null;
  /** Dirección o punto de encuentro, solo para accesibilidad (`title` del iframe, `aria-label`) -- el texto visible ya lo pinta quien use este componente, para no duplicarlo. */
  label: string;
  locale: Locale;
  location: 'contact' | 'tour';
  tourName?: string;
};

/**
 * Mapa con fachada de clic (HANDOFF §8, "El mapa — decisión revisada"):
 * cero peticiones a Google en la carga inicial, cero cookies de terceros,
 * hasta que alguien pida el mapa de verdad. Mismo patrón que
 * YouTubeFacade, adaptado a un mapa en vez de un video.
 */
export function MapFacade({ embedHtml, geo, externalUrl, label, locale, location, tourName }: MapFacadeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = COPY[locale];

  const embedSrc = extractGoogleMapsEmbedSrc(embedHtml) ?? (geo ? buildMapsEmbedFromGeo(geo.lat, geo.lng) : null);
  const resolvedExternalUrl = externalUrl ?? (geo ? buildMapsExternalUrl(geo.lat, geo.lng) : null);

  if (!embedSrc && !resolvedExternalUrl) return null;

  return (
    <div className={styles.wrap}>
      {embedSrc && !isOpen && (
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

      {embedSrc && isOpen && (
        <div className={styles.iframeWrap}>
          <iframe src={embedSrc} title={label} loading="lazy" className={styles.iframe} referrerPolicy="no-referrer-when-downgrade" />
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
