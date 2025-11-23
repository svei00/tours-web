import type { ReactNode } from 'react';

import styles from './container.module.css';

/**
 * Envoltorio de ancho máximo con el padding lateral estándar. `wide` usa la
 * variante de 1600px (HANDOFF §7, "Layout") para secciones que necesitan
 * más aire, como la tira de video vertical. `className` es opcional, para
 * casos puntuales donde quien usa el Container necesita agregar una regla
 * local (ej. site-header.module.css, que lo estira a la altura completa
 * de la fila) sin tocar el CSS base compartido.
 */
export function Container({ children, wide = false, className }: { children: ReactNode; wide?: boolean; className?: string }) {
  const base = wide ? styles.wide : styles.container;
  return <div className={className ? `${base} ${className}` : base}>{children}</div>;
}
