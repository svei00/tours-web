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
 * bug. Cada item lleva ícono (feedback del cliente: el de "Inicio" con
 * ⌂ no convencía, y pidió que el resto también tuviera uno) — se quedan
 * como emoji, mismo criterio que ☰/✕/🔍 en vez de una librería de SVG.
 */
const NAV_ITEMS: Record<Locale, NavItem[]> = {
  es: [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/tours', label: 'Tours', icon: '🧭' },
    { href: '/nosotros', label: 'Nosotros', icon: 'ℹ️' },
    { href: '/resenas', label: 'Reseñas', icon: '⭐' },
    { href: '/contacto', label: 'Contacto', icon: '💬' },
  ],
  en: [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/tours', label: 'Tours', icon: '🧭' },
    { href: '/about', label: 'About', icon: 'ℹ️' },
    { href: '/reviews', label: 'Reviews', icon: '⭐' },
    { href: '/contact', label: 'Contact', icon: '💬' },
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
      <Container className={styles.container}>
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
