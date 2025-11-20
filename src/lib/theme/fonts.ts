/**
 * Fraunces (titulares) y Figtree (cuerpo) — ver HANDOFF.md §7 para el
 * porqué de esta pareja (deliberadamente anti-Inter, y Fraunces en vez
 * de Playfair Display porque esta ya se lee como plantilla en sí misma).
 *
 * Auto-hospedadas vía next/font: sin petición externa a Google Fonts en
 * producción y sin layout shift al cargar.
 */

import { Figtree, Fraunces } from 'next/font/google';

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
