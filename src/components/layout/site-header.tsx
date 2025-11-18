import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/container';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { LocaleLink } from '@/components/ui/locale-link';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';

import { HeaderShell } from './header-shell';
import styles from './site-header.module.css';

type Locale = 'es' | 'en';

/**
 * Las rutas de /tours, /nosotros, /resenas y /contacto todavía no existen
 * (llegan en las Fases D, F e I) — el nav ya las enlaza porque construir
 * el header dos veces no vale la pena; van a dar 404 hasta entonces, y eso
 * es esperado, no un bug.
 */
const NAV_ITEMS: Record<Locale, { href: string; label: string }[]> = {
  es: [
    { href: '/tours', label: 'Tours' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/resenas', label: 'Reseñas' },
    { href: '/contacto', label: 'Contacto' },
  ],
  en: [
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

          <nav className={styles.nav} aria-label="Principal">
            {NAV_ITEMS[locale].map((item) => (
              <LocaleLink key={item.href} locale={locale} href={item.href} className={styles.navLink}>
                {item.label}
              </LocaleLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <LanguageSwitcher locale={locale} />
            <WhatsAppButton
              phone={siteSettings?.whatsappPrimary}
              message={WHATSAPP_MESSAGE[locale]}
              className={styles.whatsapp}
            >
              WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </Container>
    </HeaderShell>
  );
}
