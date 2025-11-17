import type { ReactNode } from 'react';

import styles from './badge.module.css';

type Variant = 'accent' | 'muted';

/** `accent` para precios/promos (fondo saturado), `muted` para categorías (fondo suave). */
export function Badge({ children, variant = 'accent' }: { children: ReactNode; variant?: Variant }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
