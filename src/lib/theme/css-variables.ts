/**
 * Vuelca src/config/brand.ts (valores fijos + paleta derivada) a texto
 * CSS que se inyecta como <style> en el <head> del layout raíz.
 *
 * Por qué inyección en vez de un archivo .css con las variables escritas
 * a mano: así "cambiar primaryColor re-tematiza el sitio entero" es
 * literal. No hay un segundo lugar que sincronizar — este texto SIEMPRE
 * refleja lo que hay ahora mismo en brand.ts.
 */

import { brand, header, motion, palette, radiusScale, sectionPadding, semanticColors, shadow, spacingScale, typeScale } from '@/config/brand';
import { COLOR_STEPS } from '@/lib/colors/derive-palette';

function colorScaleDeclarations(scaleName: 'primary' | 'accent'): string[] {
  const derived = palette[scaleName];
  const declarations = COLOR_STEPS.map((step) => `  --color-${scaleName}-${step}: ${derived.scale[step]};`);
  declarations.push(`  --color-${scaleName}-hover: ${derived.hover};`);
  declarations.push(`  --color-${scaleName}-active: ${derived.active};`);
  declarations.push(`  --color-${scaleName}-foreground: ${derived.foreground};`);
  return declarations;
}

export function buildThemeCss(): string {
  const lines: string[] = [':root {'];

  lines.push(...colorScaleDeclarations('primary'));
  lines.push(...colorScaleDeclarations('accent'));
  lines.push(`  --color-trench: ${palette.trench};`);

  for (const [name, value] of Object.entries(semanticColors)) {
    lines.push(`  --color-${name}: ${value};`);
  }

  for (const [name, value] of Object.entries(typeScale)) {
    lines.push(`  --font-size-${name}: ${value};`);
  }

  for (const [name, value] of Object.entries(spacingScale)) {
    lines.push(`  --space-${name}: ${value};`);
  }
  lines.push(`  --space-section: ${sectionPadding};`);

  for (const [name, value] of Object.entries(radiusScale)) {
    lines.push(`  --radius-${name}: ${value};`);
  }

  lines.push(`  --motion-fast: ${motion.fast};`);
  lines.push(`  --motion-base: ${motion.base};`);
  lines.push(`  --motion-slow: ${motion.slow};`);
  lines.push(`  --motion-easing: ${motion.easing};`);

  lines.push(`  --shadow-card: ${shadow};`);

  lines.push(`  --header-height-loose: ${header.heightLoose};`);
  lines.push(`  --header-height-pilled: ${header.heightPilled};`);
  lines.push(`  --header-pill-max-width: ${header.pillMaxWidth};`);
  lines.push(`  --header-blur: ${header.blur};`);
  lines.push(`  --header-scrim: rgba(255, 255, 255, ${header.scrimOpacity});`);
  lines.push(`  --header-loose-blur: ${header.looseBlur};`);
  lines.push(`  --header-loose-scrim: rgba(255, 255, 255, ${header.looseScrimOpacity});`);

  lines.push('}');

  return lines.join('\n');
}

export const businessName = brand.businessName;
