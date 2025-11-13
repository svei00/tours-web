'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '@sanity-studio/sanity.config';

/**
 * Sanity Studio embebido en Next.js, fuera de /[locale] a propósito — es
 * una herramienta de administración, no una página de marketing bilingüe
 * (ver HANDOFF §6, mapa de páginas: /studio no lleva prefijo de idioma).
 *
 * 'use client' es obligatorio aquí, no estilístico: sanity.config.ts tira
 * de paquetes internos de Sanity que no son compatibles con el grafo de
 * Server Components de Next.js (ver el error de "swr" en NOTES.md, Fase B)
 * — todo el Studio tiene que vivir del lado del cliente.
 */

export default function StudioPage() {
  return <NextStudio config={config} />;
}
