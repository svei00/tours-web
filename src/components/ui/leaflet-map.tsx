'use client';

/**
 * El mapa de Leaflet de verdad, en su propio archivo a propósito: se monta
 * vía `next/dynamic({ ssr: false })` desde `map-facade.tsx`, y solo cuando
 * ese componente dinámico se renderiza por primera vez -- que en este
 * componente pasa únicamente después del clic en la fachada -- Next separa
 * TANTO este JS COMO el `import` de `leaflet.css` de abajo en su propio
 * chunk aparte. Es la forma soportada de Next.js de diferir una librería
 * de terceros hasta que de verdad se necesita (HANDOFF §8, "El mapa —
 * segunda revisión").
 */
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useRef } from 'react';

import styles from './leaflet-map.module.css';

type LeafletMapProps = {
  lat: number;
  lng: number;
  label: string;
};

/**
 * Ícono dibujado en CSS (`L.divIcon`), no el marcador de imagen por
 * default de Leaflet -- ese default tiene un bug clásico y muy conocido
 * con empaquetadores (Webpack/Turbopack no resuelven bien la ruta de sus
 * PNG, el marcador sale roto) que no vale la pena perseguir cuando un pin
 * en CSS del color de marca resuelve lo mismo sin esa fragilidad.
 */
function buildPinIcon(): L.DivIcon {
  return L.divIcon({
    className: styles.pinIcon,
    html: `<span class="${styles.pinDot}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
}

export default function LeafletMap({ lat, lng, label }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
    });

    /**
     * Tiles de OpenStreetMap -- sin llave de API, sin cuenta de
     * facturación, de verdad gratis (HANDOFF §4, presupuesto cero pesos).
     * La atribución NO es opcional -- es la condición de uso del servidor
     * de tiles gratuito de OSM, y Leaflet la muestra por default; no se
     * quita.
     */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lng], { icon: buildPinIcon(), alt: label }).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng, label]);

  return <div ref={containerRef} className={styles.container} role="img" aria-label={label} />;
}
