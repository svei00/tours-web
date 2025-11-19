/**
 * Fraunces (titulares) y Figtree (cuerpo) — ver HANDOFF.md §7 para el
 * porqué de esta pareja (deliberadamente anti-Inter, y Fraunces en vez
 * de Playfair Display porque esta ya se lee como plantilla en sí misma).
 *
 * Auto-hospedadas vía next/font: sin petición externa a Google Fonts en
 * producción y sin layout shift al cargar.
 */

import { Figtree, Fraunces, Pinyon_Script } from 'next/font/google';

export const headlineFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

export const bodyFont = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Solo para el wordmark "Pura Vida" (BrandLockup) -- el logo aprobado en
 * reference/nautilus/ usa una cursiva/manuscrita, no una serif. Pinyon
 * Script es la más cercana disponible auto-hospedada vía next/font; no es
 * pixel-perfect contra el logo, pero es la misma familia de trazo fluido.
 * Nunca se usa para nada más que el nombre del negocio -- el resto del
 * sitio se queda en Fraunces/Figtree.
 */
export const wordmarkFont = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-wordmark',
  display: 'swap',
});
