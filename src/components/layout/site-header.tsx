import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/container';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { LocaleLink } from '@/components/ui/locale-link';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';

import { HeaderShell } from './header-shell';
import { MobileNav } from './mobile-nav';
import { NavLinks, type NavItem } from './nav-links';
import { SearchForm } from './search-form';
import styles from './site-header.module.css';

type Locale = 'es' | 'en';

/**
 * Las rutas de /nosotros, /resenas y /contacto todavía no existen (llegan
 * en las Fases F e I, y /nosotros no tiene fase dueña todavía -- ver
 * NOTES.md) — el nav ya las enlaza porque construir el header dos veces
 * no vale la pena; van a dar 404 hasta entonces, y eso es esperado, no un
 * bug. "Inicio"/"Home" se agrega con ícono a pedido del cliente, para que
 * quede claro en qué página está uno (ver NavLinks para el estado activo).
 */
const NAV_ITEMS: Record<Locale, NavItem[]> = {
  es: [
    { href: '/', label: 'Inicio', icon: '⌂' },
    { href: '/tours', label: 'Tours' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/resenas', label: 'Reseñas' },
    { href: '/contacto', label: 'Contacto' },
  ],
  en: [
    { href: '/', label: 'Home', icon: '⌂' },
    { href: '/tours', label: 'Tours' },
    { href: '/about', label: 'About' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ],
};

const WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

export async function SiteHeader({ locale }: { locale: Locale }) {
  const siteSettings = await getSiteSettings();

  return (
    <HeaderShell>
      <Container>
        <div className={styles.row}>
          <LocaleLink locale={locale} href="/" className={styles.logo}>
            <BrandLockup tone="ink" size="sm" />
          </LocaleLink>

          <NavLinks items={NAV_ITEMS[locale]} locale={locale} variant="bar" />

          <div className={styles.actions}>
            <SearchForm locale={locale} variant="icon" />
            <LanguageSwitcher locale={locale} />
            <WhatsAppButton
              phone={siteSettings?.whatsappPrimary}
              message={WHATSAPP_MESSAGE[locale]}
              className={styles.whatsapp}
            >
              WhatsApp
            </WhatsAppButton>
            <MobileNav items={NAV_ITEMS[locale]} locale={locale} />
          </div>
        </div>
      </Container>
    </HeaderShell>
  );
}
