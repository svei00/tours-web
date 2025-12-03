'use client';

import { trackShareClick } from '@/lib/analytics/events';
import type { Locale } from '@/lib/sanity/types';

import { FacebookIcon, WhatsappIcon } from './social-icons';
import styles from './share-buttons.module.css';

const LABEL: Record<Locale, { heading: string; facebook: string; whatsapp: string }> = {
  es: { heading: 'Compartir', facebook: 'Compartir en Facebook', whatsapp: 'Compartir por WhatsApp' },
  en: { heading: 'Share', facebook: 'Share on Facebook', whatsapp: 'Share on WhatsApp' },
};

/**
 * HANDOFF §8: el de Facebook es un botón de COMPARTIR -- abre Facebook con
 * la página precargada para que la persona la publique, no publica solo en
 * la página del cliente (eso necesitaría la Graph API de Meta, fuera de
 * alcance). El de WhatsApp usa el mismo `wa.me` que el resto del sitio,
 * pero sin número -- deja que la persona elija a quién reenviárselo.
 */
export function ShareButtons({ url, title, tourName, locale }: { url: string; title: string; tourName: string; locale: Locale }) {
  const label = LABEL[locale];
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className={styles.wrap}>
      <span className={styles.heading}>{label.heading}</span>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={label.facebook}
        onClick={() => trackShareClick('facebook', tourName)}
      >
        <FacebookIcon />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={label.whatsapp}
        onClick={() => trackShareClick('whatsapp', tourName)}
      >
        <WhatsappIcon />
      </a>
    </div>
  );
}
