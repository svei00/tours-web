import { brand } from '@/config/brand';
import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/container';
import { LocaleLink } from '@/components/ui/locale-link';
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/social-icons';
import { buildWhatsAppUrl, formatPhoneDisplay } from '@/lib/whatsapp';
import { getSiteSettings } from '@/lib/sanity/queries';

import styles from './site-footer.module.css';

type Locale = 'es' | 'en';

const WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

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

const CREDIT_LABEL: Record<Locale, string> = {
  es: 'Sitio creado por',
  en: 'Site by',
};

const DEVELOPER_NAME = 'Ivan Villanueva';
const DEVELOPER_PORTFOLIO_URL = 'https://portfolio.excelsolutionsv.com';

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
                {siteSettings.whatsappPrimaryName ? `${siteSettings.whatsappPrimaryName}: ` : ''}
                {formatPhoneDisplay(siteSettings.whatsappPrimary)}
              </a>
            )}
            {siteSettings?.whatsappSecondary && (
              <a
                href={buildWhatsAppUrl(siteSettings.whatsappSecondary, WHATSAPP_MESSAGE[locale])}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteSettings.whatsappSecondaryName ? `${siteSettings.whatsappSecondaryName}: ` : ''}
                {formatPhoneDisplay(siteSettings.whatsappSecondary)}
              </a>
            )}
            {siteSettings?.email && <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>}
          </div>

          <div className={styles.column}>
            {siteSettings?.googleBusinessProfileUrl && (
              <a href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer">
                {GBP_LABEL[locale]}
              </a>
            )}
            {siteSettings?.facebookUrl && (
              <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FacebookIcon />
                Facebook
              </a>
            )}
            {siteSettings?.instagramUrl && (
              <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <InstagramIcon />
                Instagram
              </a>
            )}
            {siteSettings?.tiktokUrl && (
              <a href={siteSettings.tiktokUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <TiktokIcon />
                TikTok
              </a>
            )}
            {siteSettings?.youtubeUrl && (
              <a href={siteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <YoutubeIcon />
                YouTube
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
        <p className={styles.credit}>
          {CREDIT_LABEL[locale]}{' '}
          <a href={DEVELOPER_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            {DEVELOPER_NAME}
          </a>
        </p>
      </Container>
    </footer>
  );
}
