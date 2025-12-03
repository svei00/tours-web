import { Container } from '@/components/ui/container';
import { LocaleLink } from '@/components/ui/locale-link';
import { NautilusMark } from '@/components/ui/nautilus-mark';
import { Section } from '@/components/ui/section';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { getSiteSettings } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';

import styles from './coming-soon.module.css';

const COPY: Record<Locale, { body: string; cta: string; message: string; back: string }> = {
  es: {
    body: 'Todavía estamos armando esta sección. Mientras tanto, escríbenos por WhatsApp — con gusto te ayudamos directo.',
    cta: 'Escribir por WhatsApp',
    message: 'Hola, quiero información sobre los tours',
    back: '← Volver al inicio',
  },
  en: {
    body: "We're still putting this section together. In the meantime, message us on WhatsApp — happy to help directly.",
    cta: 'Message us on WhatsApp',
    message: 'Hi, I want information about the tours',
    back: '← Back to home',
  },
};

/** Cada letra rebota con un pequeño retraso escalonado -- feedback del cliente: "bouncing letters" en vez de un 404 plano. */
function BouncingTitle({ text }: { text: string }) {
  return (
    <h1 className={styles.title} aria-label={text}>
      {text.split('').map((char, index) => (
        <span key={index} className={styles.letter} style={{ animationDelay: `${index * 0.07}s` }} aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </h1>
  );
}

/**
 * Reemplaza el 404 crudo de Next para rutas que el nav ya enlaza pero
 * todavía no tienen página real (/nosotros, /contacto, /resenas -- ver
 * NOTES.md, ninguna tiene fase dueña en HANDOFF §14 todavía). A
 * diferencia del 404 de Next, esto sí vive dentro de app/[locale]/layout.tsx
 * -- header y footer se quedan, el sitio nunca se siente roto.
 */
export async function ComingSoon({ locale, title }: { locale: Locale; title: string }) {
  const siteSettings = await getSiteSettings();
  const copy = COPY[locale];

  return (
    <Section>
      <Container>
        <div className={styles.wrap}>
          <NautilusMark size={96} className={styles.mark} />
          <BouncingTitle text={title} />
          <p className={styles.body}>{copy.body}</p>
          <WhatsAppButton
            phone={siteSettings?.whatsappPrimary}
            secondaryPhone={siteSettings?.whatsappSecondary}
            primaryName={siteSettings?.whatsappPrimaryName}
            secondaryName={siteSettings?.whatsappSecondaryName}
            message={copy.message}
            className={styles.cta}
            location="coming_soon"
          >
            {copy.cta}
          </WhatsAppButton>
          <LocaleLink locale={locale} href="/" className={styles.back}>
            {copy.back}
          </LocaleLink>
        </div>
      </Container>
    </Section>
  );
}
