/**
 * FUENTE DE VERDAD DE MARCA — ver HANDOFF.md §7.
 *
 * Ningún otro archivo del proyecto debe escribir a mano un color, un
 * tamaño de tipografía, un espaciado o un radio de borde. Todo se lee
 * de aquí (directo o vía la paleta derivada) y se vuelca a variables
 * CSS en src/lib/theme/css-variables.ts.
 *
 * Para re-tematizar el sitio completo para un cliente nuevo: cambiar
 * `primaryColor` y `accentColor`. Si el hex elegido no tiene contraste
 * suficiente para texto de botón, derivePalette() lanza un error al
 * cargar este módulo y el build (o `next dev`) falla explicando por qué.
 */

import { derivePalette } from '@/lib/colors/derive-palette';

export const brand = {
  businessName: 'Sandoval Tours',

  // Únicas dos entradas de color reales. Todo lo demás en `palette` se deriva de estas.
  primaryColor: '#0C5D63', // Deep Pacific
  accentColor: '#E4572E', // Sunset Coral

  headlineFont: 'Fraunces',
  bodyFont: 'Figtree',
} as const;

/**
 * Valores semánticos fijos: no se derivan de primaryColor/accentColor
 * porque cumplen un rol funcional propio (fondo de página, texto, o el
 * verde de WhatsApp que debe seguir siendo reconocible sin importar la
 * marca del cliente).
 */
export const semanticColors = {
  ink: '#14201F', // texto — casi negro con matiz verde
  sand: '#F6F1E9', // fondo de página — nunca blanco puro, ver HANDOFF §7
  white: '#FFFFFF', // tarjetas
  muted: '#6B7B79', // captions, bordes, estados desactivados
  whatsapp: '#25D366', // RESERVADO — solo el CTA de WhatsApp, nada más
} as const;

/** Escala tipográfica fluida. Todos los valores usan clamp() para no romper en pantallas chicas. */
export const typeScale = {
  display: 'clamp(2.75rem, 6vw, 5rem)',
  h1: 'clamp(2.25rem, 4.5vw, 3.5rem)',
  h2: 'clamp(1.75rem, 3vw, 2.5rem)',
  h3: 'clamp(1.375rem, 2vw, 1.75rem)',
  bodyLg: '1.125rem',
  body: '1rem',
  small: '0.875rem',
  caption: '0.8125rem',
} as const;

/** Escala de espaciado en base 4px. */
export const spacingScale = {
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '6': '24px',
  '8': '32px',
  '12': '48px',
  '16': '64px',
  '24': '96px',
  '32': '128px',
  '48': '192px',
} as const;

/** Padding de sección fluido — crece con el viewport entre estos dos límites. */
export const sectionPadding = 'clamp(4rem, 10vw, 10rem)';

/**
 * Radios deliberadamente distintos por uso (ver HANDOFF §7). Corrección
 * directa a la señal de "mismo radio en todos lados" de un sitio genérico.
 */
export const radiusScale = {
  none: '0px', // imágenes que van a sangre
  sm: '4px', // insignias
  md: '10px', // botones
  lg: '20px', // tarjetas
  pill: '999px', // tags, botón de WhatsApp
} as const;

export const motion = {
  fast: '150ms',
  base: '250ms',
  slow: '450ms',
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

/**
 * Una sola sombra (HANDOFF §7): el contraste arena/blanco ya separa las
 * tarjetas, así que no hace falta más que una elevación suave.
 */
export const shadow = '0 12px 24px -8px rgba(20, 32, 31, 0.18)';

/**
 * Se ejecuta en cuanto se importa este módulo. Si primaryColor o
 * accentColor no alcanzan contraste AA, esto lanza y el build falla
 * aquí mismo — ese es el mecanismo de seguridad de la perilla de
 * re-tematización.
 */
export const palette = derivePalette({
  primaryHex: brand.primaryColor,
  accentHex: brand.accentColor,
});
