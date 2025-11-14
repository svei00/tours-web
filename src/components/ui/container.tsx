import type { ReactNode } from 'react';

import styles from './container.module.css';

/**
 * Envoltorio de ancho máximo con el padding lateral estándar. `wide` usa la
 * variante de 1600px (HANDOFF §7, "Layout") para secciones que necesitan
 * más aire, como la tira de video vertical.
 */
export function Container({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={wide ? styles.wide : styles.container}>{children}</div>;
}
