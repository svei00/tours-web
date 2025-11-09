/**
 * El mecanismo de re-tematización (ver HANDOFF.md §7).
 *
 * Toma dos hexadecimales de entrada (primario y acento) y deriva todo lo
 * demás: la escala 50-900 de cada uno, sus estados hover/active, y el
 * tono "trench" para fondos oscuros (footer, nav, overlays).
 *
 * Las dos entradas se validan distinto porque HANDOFF.md §7 las describe
 * distinto:
 *
 * - PRIMARIO tiene que sostener texto BLANCO ("lo bastante oscuro y
 *   saturado para cargar texto blanco con contraste AA completo" — la
 *   corrección directa al cian del volante). Por eso aquí se exige
 *   blanco específicamente y se lanza si no alcanza AA, en vez de caer
 *   en silencio a negro: un CTA saturado con texto negro se ve a
 *   genérico de formulario, justo lo que el documento quiere evitar.
 * - ACENTO no tiene ese requisito ("se gana su lugar solo en precios y
 *   promociones" — insignias, no botones grandes), así que aquí se elige
 *   automáticamente entre blanco y negro, el que dé más contraste.
 *
 * Nota de implementación: elegir el mejor de blanco-o-negro nunca puede
 * bajar de ~4.58:1 sobre un color sólido (el peor caso es un gris
 * medio), así que ese modo de validación es, en la práctica, siempre
 * verde — es una red de seguridad de último recurso, no la barandilla
 * principal. La barandilla real para el "amarillo brillante" que
 * HANDOFF.md §7 pone como ejemplo es la del primario.
 *
 * Como brand.ts llama a derivePalette() en cuanto el módulo se carga,
 * cualquier error de esta validación revienta el build (o la sesión de
 * desarrollo) en vez de dejar pasar botones ilegibles en silencio.
 */

import { contrastRatio, hexToHsl, hslToHex } from './color-math';

const AA_MINIMUM_CONTRAST = 4.5;

const WHITE = '#FFFFFF';
const BLACK = '#000000';

/** Los diez pasos de cada escala de color, en el orden en que se generan. */
const COLOR_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type ColorStep = (typeof COLOR_STEPS)[number];
export type ColorScale = Record<ColorStep, string>;

/** Lightness objetivo en los extremos de la escala. El paso 500 usa la lightness real del hex de entrada. */
const LIGHTEST_STEP_TARGET_L = 0.97;
const DARKEST_STEP_TARGET_L = 0.12;

export type DerivedColor = {
  scale: ColorScale;
  hover: string;
  active: string;
  /** Blanco o negro — validado contra el paso 500 antes de salir de este módulo. */
  foreground: string;
};

export type Palette = {
  primary: DerivedColor;
  accent: DerivedColor;
  /** Tono oscuro derivado del primario, para footer, nav y overlays sobre imagen. */
  trench: string;
};

/**
 * Genera la escala 50-900 interpolando la lightness (en HSL) entre un
 * extremo casi blanco, el color de entrada anclado en el paso 500, y un
 * extremo casi negro. El matiz y la saturación se mantienen constantes:
 * lo único que cambia paso a paso es qué tan claro u oscuro se ve.
 */
function generateColorScale(inputHex: string): ColorScale {
  const { h, s, l: baseLightness } = hexToHsl(inputHex);
  const baseStepIndex = COLOR_STEPS.indexOf(500);

  const scale = {} as ColorScale;

  COLOR_STEPS.forEach((step, index) => {
    if (step === 500) {
      scale[step] = inputHex.toUpperCase();
      return;
    }

    const isLighterThanBase = index < baseStepIndex;
    const progress = isLighterThanBase
      ? index / baseStepIndex
      : (index - baseStepIndex) / (COLOR_STEPS.length - 1 - baseStepIndex);

    const anchorLightness = isLighterThanBase ? LIGHTEST_STEP_TARGET_L : DARKEST_STEP_TARGET_L;
    // progress = 0 en el paso 500 (el ancla es el propio color); progress = 1 en el extremo de la escala.
    const stepLightness = isLighterThanBase
      ? anchorLightness + (baseLightness - anchorLightness) * progress
      : baseLightness + (anchorLightness - baseLightness) * progress;

    scale[step] = hslToHex({ h, s, l: stepLightness });
  });

  return scale;
}

/**
 * Deriva un tono oscuro del color base para fondos grandes (footer, nav,
 * overlays sobre foto). Mismo matiz, saturación ligeramente aumentada
 * para que no se vea lavado, lightness reducida a ~63% de la original.
 * Esos multiplicadores están calibrados para reproducir, a partir de
 * '#0C5D63', el tono de referencia '#063C41' descrito en HANDOFF.md §7.
 */
function deriveTrench(inputHex: string): string {
  const { h, s, l } = hexToHsl(inputHex);
  return hslToHex({ h, s: Math.min(1, s * 1.05), l: l * 0.63 });
}

/** Compone el mensaje de error compartido por las dos validaciones de abajo. */
function buildContrastError(surfaceLabel: string, backgroundHex: string, contrast: number, requirement: string): string {
  return (
    `El color ${surfaceLabel} (${backgroundHex}) no alcanza el contraste mínimo AA de ${AA_MINIMUM_CONTRAST}:1 ` +
    `${requirement} (contraste actual: ${contrast.toFixed(2)}:1). Elige un tono más oscuro o más saturado ` +
    `en src/config/brand.ts.`
  );
}

/**
 * Primario: exige blanco específicamente. Ver la nota de arriba sobre
 * por qué no basta con "el mejor de blanco o negro" para este color.
 */
function derivePrimary(inputHex: string): DerivedColor {
  const scale = generateColorScale(inputHex);
  const contrast = contrastRatio(scale[500], WHITE);

  if (contrast < AA_MINIMUM_CONTRAST) {
    throw new Error(
      buildContrastError('primario', scale[500], contrast, 'con texto blanco sobre una superficie de botón'),
    );
  }

  return { scale, hover: scale[600], active: scale[700], foreground: WHITE };
}

/**
 * Acento: sin ese requisito — se usa en insignias de precio y
 * promociones, no en botones grandes, así que elige el mejor de blanco
 * o negro. Ver la nota de arriba sobre por qué esta rama, en la
 * práctica, casi nunca lanza.
 */
function deriveAccent(inputHex: string): DerivedColor {
  const scale = generateColorScale(inputHex);
  const contrastWithWhite = contrastRatio(scale[500], WHITE);
  const contrastWithBlack = contrastRatio(scale[500], BLACK);
  const useWhite = contrastWithWhite >= contrastWithBlack;
  const bestContrast = useWhite ? contrastWithWhite : contrastWithBlack;

  if (bestContrast < AA_MINIMUM_CONTRAST) {
    throw new Error(
      buildContrastError('de acento', scale[500], bestContrast, 'con el mejor de blanco o negro encima'),
    );
  }

  return { scale, hover: scale[600], active: scale[700], foreground: useWhite ? WHITE : BLACK };
}

export function derivePalette({ primaryHex, accentHex }: { primaryHex: string; accentHex: string }): Palette {
  return {
    primary: derivePrimary(primaryHex),
    accent: deriveAccent(accentHex),
    trench: deriveTrench(primaryHex),
  };
}

export { COLOR_STEPS };
