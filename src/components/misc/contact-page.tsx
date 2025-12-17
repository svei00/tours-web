import type { Metadata } from 'next';

import { Container } from '@/components/ui/container';
import { MapFacade } from '@/components/ui/map-facade';
import { Section } from '@/components/ui/section';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { buildAlternates, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getContactPage } from '@/lib/sanity/pages';
import { getSiteSettings, type SiteAddress } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';
import { formatPhoneDisplay } from '@/lib/whatsapp';

import styles from './contact-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Contacto', en: 'Contact' };

/** Copy de arranque si Svei todavía no crea el documento `contactPage` -- misma idea que about-page.tsx. */
const FALLBACK_INTRO: Record<Locale, string> = {
  es: '¿Tienes dudas sobre un tour o quieres reservar? Escríbenos por WhatsApp — es la forma más rápida de obtener respuesta. También puedes encontrarnos aquí:',
  en: "Have questions about a tour or want to book? Message us on WhatsApp — it's the fastest way to get a reply. You can also find us here:",
};

const WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

const WHATSAPP_CTA: Record<Locale, string> = { es: 'Escribir por WhatsApp', en: 'Message us on WhatsApp' };
const PHONES_LABEL: Record<Locale, string> = { es: 'Teléfono', en: 'Phone' };
const EMAIL_LABEL: Record<Locale, string> = { es: 'Correo', en: 'Email' };
const ADDRESS_LABEL: Record<Locale, string> = { es: 'Dirección', en: 'Address' };
const HOURS_LABEL: Record<Locale, string> = { es: 'Horario', en: 'Hours' };
const GBP_LABEL: Record<Locale, string> = { es: 'Perfil de Google', en: 'Google Profile' };
const EMPTY_CARD: Record<Locale, string> = {
  es: 'Todavía no hay datos de contacto cargados en Configuración.',
  en: 'No contact details have been loaded in Settings yet.',
};

function formatAddress(address: SiteAddress | null): string | null {
  if (!address) return null;
  const parts = [address.street, address.city, address.state, address.postalCode, address.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return { title: TITLE[typedLocale], alternates: buildAlternates(typedLocale, LOCALIZED_PATHS.contact.es, LOCALIZED_PATHS.contact.en) };
}

/** Compartido por /contacto y /contact. Sin formulario a propósito -- el cliente lo rechazó, la conversión es por WhatsApp (HANDOFF §1). */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const [doc, siteSettings] = await Promise.all([getContactPage(), getSiteSettings()]);

  const introEs = doc?.intro?.es;
  const introEn = typedLocale === 'en' && doc?.intro?.en ? doc.intro.en : introEs;
  const intro = introEn || FALLBACK_INTRO[typedLocale];

  const address = formatAddress(siteSettings?.address ?? null);
  const hasAnyContactDetail = Boolean(
    siteSettings?.phones?.length || siteSettings?.email || address || siteSettings?.openingHours || siteSettings?.googleBusinessProfileUrl,
  );

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE[typedLocale]}</h1>
          <p className={styles.intro}>{intro}</p>
        </header>

        <div className={styles.layout}>
          <div>
            <WhatsAppButton
              phone={siteSettings?.whatsappPrimary}
              secondaryPhone={siteSettings?.whatsappSecondary}
              primaryName={siteSettings?.whatsappPrimaryName}
              secondaryName={siteSettings?.whatsappSecondaryName}
              message={WHATSAPP_MESSAGE[typedLocale]}
              className={styles.cta}
              location="detail"
            >
              {WHATSAPP_CTA[typedLocale]}
            </WhatsAppButton>
          </div>

          <div className={styles.card}>
            {!hasAnyContactDetail && <p className={styles.empty}>{EMPTY_CARD[typedLocale]}</p>}

            {siteSettings?.phones && siteSettings.phones.length > 0 && (
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>{PHONES_LABEL[typedLocale]}</span>
                {siteSettings.phones.map((phone) => (
                  <span key={phone} className={styles.cardValue}>
                    {formatPhoneDisplay(phone)}
                  </span>
                ))}
              </div>
            )}

            {siteSettings?.email && (
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>{EMAIL_LABEL[typedLocale]}</span>
                <span className={styles.cardValue}>
                  <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
                </span>
              </div>
            )}

            {address && (
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>{ADDRESS_LABEL[typedLocale]}</span>
                <span className={styles.cardValue}>{address}</span>
              </div>
            )}

            <MapFacade
              geo={siteSettings?.address?.geo ?? null}
              label={address ?? TITLE[typedLocale]}
              locale={typedLocale}
              location="contact"
            />

            {siteSettings?.openingHours && (
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>{HOURS_LABEL[typedLocale]}</span>
                <span className={styles.cardValue}>{siteSettings.openingHours}</span>
              </div>
            )}

            {siteSettings?.googleBusinessProfileUrl && (
              <div className={styles.cardRow}>
                <span className={styles.cardValue}>
                  <a href={siteSettings.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer">
                    {GBP_LABEL[typedLocale]}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
