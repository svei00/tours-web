import { createClient } from 'next-sanity';

/**
 * Cliente de solo lectura para el frontend público. El dataset "production"
 * de Sanity es público por default, así que estas consultas no necesitan
 * token — si algún día el dataset se vuelve privado, este es el único
 * archivo que necesita un `token`.
 */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  /**
   * `false` a propósito. Con el CDN de Sanity activo se apilaban dos
   * cachés — hasta ~60s del CDN más los 60s del ISR de Next (revalidate en
   * app/[locale]/layout.tsx) — y publicar un cambio podía tardar ~2 min en
   * verse. A este volumen de tráfico el CDN no compra nada y sí hacía que
   * "publiqué y no pasó nada" fuera ambiguo. Que Next sea la única capa de
   * caché deja el peor caso en 60s y bien entendido.
   */
  useCdn: false,
});
