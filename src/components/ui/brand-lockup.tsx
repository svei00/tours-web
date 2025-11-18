import { brand } from '@/config/brand';

import { NautilusMark } from './nautilus-mark';
import styles from './brand-lockup.module.css';

type BrandLockupProps = {
  /** `ink` para superficies claras (header, tarjetas blancas); `white` para trench (footer). */
  tone?: 'ink' | 'white';
  size?: 'sm' | 'md';
  className?: string;
};

const MARK_SIZE: Record<NonNullable<BrandLockupProps['size']>, number> = {
  sm: 40,
  md: 52,
};

/**
 * Ícono + nombre, el lockup que reemplaza el texto plano del header/footer.
 * Estructura tomada directo del logo aprobado (reference/nautilus/): marca
 * + "Pura Vida" + regla + "TRAVEL" en versalitas espaciadas. La tipografía
 * del nombre usa Fraunces (el token de headline ya establecido) en vez de
 * intentar igualar el script cursivo del arte del logo — mantiene el
 * nombre como texto real (SEO, sin fuente nueva que cargar) sin romper el
 * sistema de un solo lugar para tipografía (HANDOFF §7).
 *
 * El ícono lleva `alt=""` porque el texto de al lado ya lo anuncia — este
 * componente vive casi siempre dentro de un link a "/", así que duplicar
 * el nombre en el alt sería ruido para lectores de pantalla.
 */
export function BrandLockup({ tone = 'ink', size = 'sm', className }: BrandLockupProps) {
  const classes = [styles.lockup, styles[tone], styles[size], className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <NautilusMark size={MARK_SIZE[size]} className={styles.mark} />
      <span className={styles.wordmark}>
        <span className={styles.name}>{brand.businessNameShort}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.tagline}>{brand.tagline}</span>
      </span>
    </span>
  );
}
