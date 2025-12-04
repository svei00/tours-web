import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { brand } from '@/config/brand';
import { buildAlternates, draftLegalMetadata, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import { getSiteSettings, type SiteAddress } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';

import styles from './legal-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Aviso de privacidad', en: 'Privacy notice' };

/**
 * Ya no es ComingSoon (Fase I) -- sigue con `noindex` porque el borrador de
 * HANDOFF §15.5 todavía trae campos entre corchetes sin llenar (razón
 * social, fecha de vigencia). Ver draftLegalMetadata para el porqué.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return { ...draftLegalMetadata(TITLE[typedLocale]), alternates: buildAlternates(typedLocale, LOCALIZED_PATHS.privacy.es, LOCALIZED_PATHS.privacy.en) };
}

/** Envuelve en corchetes y en coral -- mismo formato que el borrador de HANDOFF §15.5, para que sea obvio de un vistazo qué falta llenar. */
function Placeholder({ children }: { children: ReactNode }) {
  return <span className={styles.placeholder}>[{children}]</span>;
}

function formatAddress(address: SiteAddress | null, locale: Locale): ReactNode {
  const hasStreetOrCity = Boolean(address?.street || address?.city);
  if (!hasStreetOrCity) return <Placeholder>{locale === 'en' ? 'complete registered business address' : 'domicilio fiscal completo'}</Placeholder>;

  const parts = [address?.street, address?.city, address?.state, address?.postalCode, address?.country].filter(Boolean);
  return parts.join(', ');
}

const DISCLAIMER: Record<Locale, string> = {
  es: 'Este es un borrador estructural (HANDOFF §15.5), no asesoría legal. Los campos en corcheta color coral deben ser revisados y completados por el cliente o por Svei antes de publicar el sitio.',
  en: 'This is a structural draft, not legal advice. The coral bracketed fields must be reviewed and completed by the client or by Svei before the site goes live.',
};

const UPDATED_LABEL: Record<Locale, string> = { es: 'Última actualización: ', en: 'Last updated: ' };

/** Compartido por /privacidad y /privacy. */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const siteSettings = await getSiteSettings();

  const arcoEmail = siteSettings?.email ?? <Placeholder>{typedLocale === 'es' ? 'correo electrónico' : 'email address'}</Placeholder>;
  const address = formatAddress(siteSettings?.address ?? null, typedLocale);

  if (typedLocale === 'en') {
    return (
      <Section>
        <Container>
          <header className={styles.header}>
            <h1 className={styles.title}>{TITLE.en}</h1>
            <p className={styles.updated}>
              {UPDATED_LABEL.en}
              <Placeholder>date</Placeholder>
            </p>
            <p className={styles.disclaimer}>{DISCLAIMER.en}</p>
          </header>
          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Who is responsible for your data</h2>
              <p>
                <Placeholder>legal business name</Placeholder>, doing business as {brand.businessName}, with address at {address}, is
                responsible for the processing of your personal data.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Data we collect</h2>
              <p>
                When you contact us by WhatsApp, phone, or email, we may collect: your name, phone number, email address, and booking
                details (date, number of people, tour of interest). Our website also collects browsing data through analytics tools
                (pages visited, time on site, traffic source).
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Purposes</h2>
              <p>Primary (necessary to serve you):</p>
              <ul>
                <li>Responding to your request for information</li>
                <li>Managing and confirming your booking</li>
                <li>Coordinating with the operator that runs the tour</li>
              </ul>
              <p>Secondary (you may opt out):</p>
              <ul>
                <li>Sending you promotions and offers</li>
              </ul>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Data sharing</h2>
              <p>
                To provide the service you booked, we share your booking data with the tour operators who actually run each experience.
                This sharing is necessary to deliver the service.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Your rights (access, rectification, cancellation, objection)</h2>
              <p>
                You may request access to, correction of, deletion of, or objection to the processing of your personal data by writing
                to {arcoEmail}. We will respond within a maximum of <Placeholder>20</Placeholder> business days.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Cookies and tracking</h2>
              <p>
                This site uses Google Analytics cookies to measure traffic. You can disable them from your browser settings. Contacting
                us on WhatsApp starts a conversation on a third-party platform subject to its own policies.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Changes to this notice</h2>
              <p>Any change to this notice will be published on this same page.</p>
            </section>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE.es}</h1>
          <p className={styles.updated}>
            {UPDATED_LABEL.es}
            <Placeholder>fecha</Placeholder>
          </p>
          <p className={styles.disclaimer}>{DISCLAIMER.es}</p>
        </header>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Responsable</h2>
            <p>
              <Placeholder>Nombre legal completo (razón social)</Placeholder>, operando comercialmente como {brand.businessName}, con
              domicilio en {address}, es responsable del tratamiento de sus datos personales.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Datos que recabamos</h2>
            <p>
              Cuando usted nos contacta por WhatsApp, teléfono o correo, podemos recabar: nombre, número telefónico, correo electrónico,
              y los datos de la reserva (fecha, número de personas, tour de interés). Adicionalmente, nuestro sitio web recaba datos de
              navegación mediante herramientas de analítica (páginas visitadas, tiempo de permanencia, origen del tráfico).
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Finalidades</h2>
            <p>Primarias (necesarias):</p>
            <ul>
              <li>Atender su solicitud de información</li>
              <li>Gestionar y confirmar su reserva</li>
              <li>Coordinar con el operador que presta el servicio</li>
            </ul>
            <p>Secundarias (puede oponerse):</p>
            <ul>
              <li>Enviarle promociones y ofertas</li>
            </ul>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Transferencias</h2>
            <p>
              Para prestar el servicio contratado transferimos sus datos de reserva a los operadores turísticos que ejecutan cada tour.
              Esta transferencia es necesaria para la prestación del servicio.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Derechos ARCO</h2>
            <p>
              Usted puede solicitar el Acceso, Rectificación, Cancelación u Oposición al tratamiento de sus datos escribiendo a{' '}
              {arcoEmail}. Responderemos en un plazo máximo de <Placeholder>20</Placeholder> días hábiles.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies y rastreo</h2>
            <p>
              Este sitio utiliza cookies de Google Analytics para medir el tráfico. Puede deshabilitarlas desde la configuración de su
              navegador. Contactarnos por WhatsApp inicia una conversación en una plataforma de terceros sujeta a sus propias políticas.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Cambios al aviso</h2>
            <p>Cualquier cambio a este aviso se publicará en esta misma página.</p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
