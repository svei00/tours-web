import { Container } from '@/components/ui/container';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';

import styles from './contact-cta.module.css';

const COPY: Record<Locale, { title: string; subtitle: string; cta: string; message: string }> = {
  es: {
    title: '¿Listo para tu próxima aventura?',
    subtitle: 'Escríbenos por WhatsApp y te ayudamos a elegir el tour perfecto para ti.',
    cta: 'Reservar por WhatsApp',
    message: 'Hola, quiero información sobre los tours',
  },
  en: {
    title: 'Ready for your next adventure?',
    subtitle: 'Message us on WhatsApp and we help you pick the perfect tour.',
    cta: 'Book on WhatsApp',
    message: 'Hi, I want information about the tours',
  },
};

/** Cierre del home: el WhatsApp es el elemento más importante de cada página (HANDOFF §3, principio 8). */
export async function ContactCTA({ locale }: { locale: Locale }) {
  const siteSettings = await getSiteSettings();
  const copy = COPY[locale];

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.subtitle}>{copy.subtitle}</p>
          <WhatsAppButton phone={siteSettings?.whatsappPrimary} message={copy.message} className={styles.cta}>
            {copy.cta}
          </WhatsAppButton>
        </div>
      </Container>
    </section>
  );
}
