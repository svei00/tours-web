'use client';

import { usePathname } from 'next/navigation';

import { LocaleLink } from '@/components/ui/locale-link';

import styles from './nav-links.module.css';

type Locale = 'es' | 'en';
export type NavItem = { href: string; label: string; icon?: string };

/**
 * `/` es especial: solo cuenta como activo en match exacto (si no, "Inicio"
 * se quedaría marcado en todas las páginas). El resto usa match por
 * prefijo para que, por ejemplo, "Tours" siga activo en /tours/[slug].
 */
function isItemActive(pathname: string, locale: Locale, href: string): boolean {
  const fullHref = href === '/' ? `/${locale}` : `/${locale}${href}`;
  if (href === '/') return pathname === fullHref;
  return pathname === fullHref || pathname.startsWith(`${fullHref}/`);
}

/**
 * Un solo componente para el nav de escritorio (`variant="bar"`, fila
 * horizontal) y el drawer móvil (`variant="drawer"`, lista vertical) —
 * misma lógica de página activa en los dos lugares, sin duplicarla.
 */
export function NavLinks({
  items,
  locale,
  variant,
  onNavigate,
}: {
  items: NavItem[];
  locale: Locale;
  variant: 'bar' | 'drawer';
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={variant === 'bar' ? styles.bar : styles.drawer} aria-label="Principal">
      {items.map((item) => {
        const active = isItemActive(pathname, locale, item.href);
        return (
          <LocaleLink
            key={item.href}
            locale={locale}
            href={item.href}
            className={active ? `${styles.link} ${styles.active}` : styles.link}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}
          >
            {item.icon && (
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
          </LocaleLink>
        );
      })}
    </nav>
  );
}
