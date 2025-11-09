/**
 * Conversiones de color y cálculo de contraste WCAG.
 *
 * Funciones puras, sin dependencias externas. Este archivo es la base
 * matemática que usa derive-palette.ts para generar la escala de color
 * y validar el contraste de accesibilidad.
 */

export type RgbColor = { r: number; g: number; b: number };
export type HslColor = { h: number; s: number; l: number };

/**
 * Convierte un hex de 6 dígitos ("#0C5D63") a sus componentes RGB (0-255).
 * Lanza un error legible si el formato no es válido, porque este valor
 * casi siempre viene de un humano pegando un hex a mano en brand.ts.
 */
export function hexToRgb(hex: string): RgbColor {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) {
    throw new Error(
      `"${hex}" no es un color hexadecimal válido. Se espera el formato #RRGGBB, por ejemplo "#0C5D63".`,
    );
  }
  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const toHexByte = (channel: number): string =>
    Math.round(Math.min(255, Math.max(0, channel)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`.toUpperCase();
}

/**
 * RGB (0-255) a HSL con saturación y luminosidad expresadas como 0-1
 * (no 0-100), porque así son más fáciles de usar en interpolaciones.
 */
export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  const l = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l };
  }

  const s = delta / (1 - Math.abs(2 * l - 1));

  let h: number;
  switch (max) {
    case rNorm:
      h = ((gNorm - bNorm) / delta) % 6;
      break;
    case gNorm:
      h = (bNorm - rNorm) / delta + 2;
      break;
    default:
      h = (rNorm - gNorm) / delta + 4;
  }
  h *= 60;
  if (h < 0) h += 360;

  return { h, s, l };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = h / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hPrime >= 0 && hPrime < 1) [rPrime, gPrime, bPrime] = [c, x, 0];
  else if (hPrime >= 1 && hPrime < 2) [rPrime, gPrime, bPrime] = [x, c, 0];
  else if (hPrime >= 2 && hPrime < 3) [rPrime, gPrime, bPrime] = [0, c, x];
  else if (hPrime >= 3 && hPrime < 4) [rPrime, gPrime, bPrime] = [0, x, c];
  else if (hPrime >= 4 && hPrime < 5) [rPrime, gPrime, bPrime] = [x, 0, c];
  else [rPrime, gPrime, bPrime] = [c, 0, x];

  return {
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
  };
}

export function hexToHsl(hex: string): HslColor {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HslColor): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Luminancia relativa según la fórmula de WCAG 2.x. Es el insumo de
 * contrastRatio() y no tiene uso directo fuera de este archivo.
 */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const linearize = (channel8bit: number): number => {
    const channel = channel8bit / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Razón de contraste WCAG entre dos colores, de 1 (idénticos) a 21
 * (negro sobre blanco). El umbral AA para texto normal es 4.5.
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const luminanceA = relativeLuminance(hexA);
  const luminanceB = relativeLuminance(hexB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}
