'use client';

import { useEffect, useState, type ReactNode } from 'react';

import styles from './site-header.module.css';

/**
 * Envuelve el contenido del header (que se renderiza en el servidor, ver
 * site-header.tsx) y le agrega el comportamiento de pill al hacer scroll
 * (HANDOFF §6). Vive como Client Component aparte, y no como parte de
 * SiteHeader, para que SiteHeader pueda seguir siendo un Server Component
 * async que le pega a Sanity por siteSettings.
 *
 * El disparador es un IntersectionObserver sobre el centinela de 1px al
 * inicio de <main> (ver globals.css y app/[locale]/layout.tsx) — nunca un
 * listener de scroll, que corre en cada cuadro y es justo el tipo de JS
 * que arruina el presupuesto de INP (HANDOFF §9).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [pilled, setPilled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('header-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setPilled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={pilled ? `${styles.header} ${styles.pilled}` : styles.header}>
      <div className={styles.bar}>{children}</div>
    </header>
  );
}
