'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import styles from './site-header.module.css';

const HOME_PATH_PATTERN = /^\/(es|en)\/?$/;

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
 *
 * `.onHero`: solo el home tiene un Hero a sangre detrás del header
 * transparente (HeroCarousel cancela el padding-top con margin negativo,
 * ver hero-carousel.module.css) — en cualquier otra página, en estado
 * suelto, el header se sienta sobre el fondo arena normal de la página.
 * Esa diferencia importa para el color del texto (ver site-header.module.css
 * y NOTES.md): texto teal sobre el glass del hero (también teal, por el
 * degradado de trench) se leía mal — feedback del cliente.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [pilled, setPilled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const sentinel = document.getElementById('header-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => setPilled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const isHome = HOME_PATH_PATTERN.test(pathname);
  const onHero = isHome && !pilled;

  const classNames = [styles.header, pilled && styles.pilled, onHero && styles.onHero].filter(Boolean).join(' ');

  return (
    <header className={classNames}>
      <div className={styles.bar}>{children}</div>
    </header>
  );
}
