import type { ReactNode } from 'react';

import styles from './asymmetric-row.module.css';

type AsymmetricRowProps = {
  /** `featureLeft` = ancho a la izquierda (7/5). `featureRight` invierte el peso (5/7) -- HANDOFF §6. */
  variant: 'featureLeft' | 'featureRight';
  wide: ReactNode;
  narrow: ReactNode;
};

/**
 * Preset de layout nombrado (HANDOFF §6: "codificarla como presets
 * nombrados para que sea una decisión reutilizable"). El orden en el DOM
 * siempre es wide-primero, narrow-segundo -- lo único que cambia entre
 * variantes es el `order` visual en pantallas grandes; en móvil ambas
 * tarjetas van apiladas a ancho completo, sin asimetría.
 */
export function AsymmetricRow({ variant, wide, narrow }: AsymmetricRowProps) {
  const rowClass = variant === 'featureRight' ? `${styles.row} ${styles.featureRight}` : styles.row;

  return (
    <div className={rowClass}>
      <div className={styles.wide}>{wide}</div>
      <div className={styles.narrow}>{narrow}</div>
    </div>
  );
}
