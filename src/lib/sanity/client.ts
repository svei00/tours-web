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
  useCdn: true,
});
