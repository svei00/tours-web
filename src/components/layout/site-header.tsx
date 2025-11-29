import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/container';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { LocaleLink } from '@/components/ui/locale-link';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';
import { getReviewStats } from '@/lib/sanity/reviews';

import { HeaderShell } from './header-shell';
import { MobileNav } from './mobile-nav';
import { NavLinks, type NavItem } from './nav-links';
import { SearchForm } from './search-form';
import styles from './site-header.module.css';

type Locale = 'es' | 'en';

/**
 * Cada item lleva ícono (feedback del cliente: el de "Inicio" con ⌂ no
 * convencía, y pidió que el resto también tuviera uno) — se quedan como
 * emoji, mismo criterio que ☰/✕/🔍 en vez de una librería de SVG.
 *
 * "Reseñas"/"Reviews" se filtra en tiempo de render (ver más abajo) con
 * menos de seis reseñas visibles (HANDOFF §6) -- por eso no está marcado
 * aquí de ninguna forma especial, la lista completa siempre incluye el
 * item y quien decide si se queda es SiteHeader.
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

const REVIEWS_HREF: Record<Locale, string> = { es: '/resenas', en: '/reviews' };

const WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

export async function SiteHeader({ locale }: { locale: Locale }) {
  const [siteSettings, reviewStats] = await Promise.all([getSiteSettings(), getReviewStats()]);

  const navItems =
    reviewStats.count >= 6 ? NAV_ITEMS[locale] : NAV_ITEMS[locale].filter((item) => item.href !== REVIEWS_HREF[locale]);

  return (
    <HeaderShell>
      <Container className={styles.container}>
        <div className={styles.row}>
          <LocaleLink locale={locale} href="/" className={styles.logo}>
            <BrandLockup tone="ink" size="sm" />
          </LocaleLink>

          <NavLinks items={navItems} locale={locale} variant="bar" />

          <div className={styles.actions}>
            <SearchForm locale={locale} variant="icon" />
            <LanguageSwitcher locale={locale} />
            {/*
              Envoltorio dedicado en vez de pasarle `display:none` solo al
              botón interno (como antes) -- con dos números configurados,
              WhatsAppButton renderiza su propio div `.wrap` alrededor del
              botón (para el selector), y ese `.wrap` se quedaba en el flujo
              del flexbox aunque el botón de adentro estuviera oculto,
              robándose un gap de sobra en el header (parte del bug de
              Galaxy S24 -- ver también brand-lockup.module.css).
            */}
            <div className={styles.whatsappWrapper}>
              <WhatsAppButton
                phone={siteSettings?.whatsappPrimary}
                secondaryPhone={siteSettings?.whatsappSecondary}
                primaryName={siteSettings?.whatsappPrimaryName}
                secondaryName={siteSettings?.whatsappSecondaryName}
                message={WHATSAPP_MESSAGE[locale]}
                className={styles.whatsapp}
              >
                WhatsApp
              </WhatsAppButton>
            </div>
            <MobileNav
              items={navItems}
              locale={locale}
              whatsappPhone={siteSettings?.whatsappPrimary}
              whatsappSecondaryPhone={siteSettings?.whatsappSecondary}
              whatsappPrimaryName={siteSettings?.whatsappPrimaryName}
              whatsappSecondaryName={siteSettings?.whatsappSecondaryName}
              whatsappMessage={WHATSAPP_MESSAGE[locale]}
            />
          </div>
        </div>
      </Container>
    </HeaderShell>
  );
}
