import { brand } from '@/config/brand';
import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/container';
import { LocaleLink } from '@/components/ui/locale-link';
import { buildWhatsAppUrl } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';

import styles from './site-footer.module.css';

type Locale = 'es' | 'en';

const WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

/** /privacidad y /terminos llegan en la Fase I — mismo trato que el nav del header. */
const LEGAL_LINKS: Record<Locale, { href: string; label: string }[]> = {
  es: [
    { href: '/privacidad', label: 'Aviso de privacidad' },
    { href: '/terminos', label: 'Términos y condiciones' },
  ],
  en: [
    { href: '/privacy', label: 'Privacy notice' },
    { href: '/terms', label: 'Terms and conditions' },
  ],
};

const GBP_LABEL: Record<Locale, string> = {
  es: 'Perfil de Google',
  en: 'Google Profile',
};

export async function SiteFooter({ locale }: { locale: Locale }) {
  const siteSettings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            <BrandLockup tone="white" size="md" className={styles.businessName} />
            {siteSettings?.whatsappPrimary && (
              <a
                href={buildWhatsAppUrl(siteSettings.whatsappPrimary, WHATSAPP_MESSAGE[locale])}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteSettings.whatsappPrimary}
              </a>
            )}
            {siteSettings?.email && <p>{siteSettings.email}</p>}
          </div>

          <div className={styles.column}>
            {siteSettings?.googleBusinessProfileUrl && (
              <a href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer">
                {GBP_LABEL[locale]}
              </a>
            )}
            {siteSettings?.facebookUrl && (
              <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {siteSettings?.instagramUrl && (
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {siteSettings?.tiktokUrl && (
              <a href={siteSettings.tiktokUrl} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            )}
          </div>

          <div className={styles.column}>
            {LEGAL_LINKS[locale].map((item) => (
              <LocaleLink key={item.href} locale={locale} href={item.href}>
                {item.label}
              </LocaleLink>
            ))}
          </div>
        </div>

        <p className={styles.copyright}>
          © {year} {brand.businessName}
        </p>
      </Container>
    </footer>
  );
}
