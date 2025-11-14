import type { ReactNode } from 'react';

import styles from './section.module.css';

/** Padding vertical fluido estándar entre secciones (HANDOFF §7). */
export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={className ? `${styles.section} ${className}` : styles.section}>{children}</section>;
}
