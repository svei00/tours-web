'use client';

import { useState, useSyncExternalStore } from 'react';

import { trackShareClick } from '@/lib/analytics/events';
import type { Locale } from '@/lib/sanity/types';

import { ShareCopiedIcon, ShareCopyLinkIcon, ShareEmailIcon, ShareFacebookIcon, ShareNativeIcon, ShareWhatsAppIcon, ShareXIcon } from './share-icons';
import styles from './share-buttons.module.css';

/**
 * `navigator.share` no cambia de valor durante la vida de la página --no
 * hay evento de "cambió el soporte de compartir nativo"--, así que no hace
 * falta un efecto con setState (eso dispara el lint de React de "cascading
 * renders", ver el comentario en el componente). `useSyncExternalStore` es
 * el patrón que React mismo recomienda para leer un valor externo con
 * snapshot de servidor seguro: `getServerSnapshot` cae a `false` (no hay
 * `navigator` en el servidor), y el cliente lee el valor real sin
 * necesidad de una suscripción de verdad -- `subscribe` no hace nada
 * porque no hay nada a lo que suscribirse.
 */
function subscribeNoop() {
  return () => {};
}
function getNativeShareSnapshot() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}
function getNativeShareServerSnapshot() {
  return false;
}

const LABEL: Record<
  Locale,
  { heading: string; facebook: string; whatsapp: string; x: string; email: string; native: string; copy: string; copied: string }
> = {
  es: {
    heading: 'Compartir',
    facebook: 'Compartir en Facebook',
    whatsapp: 'Compartir por WhatsApp',
    x: 'Compartir en X',
    email: 'Compartir por correo',
    native: 'Compartir…',
    copy: 'Copiar liga',
    copied: '¡Copiado!',
  },
  en: {
    heading: 'Share',
    facebook: 'Share on Facebook',
    whatsapp: 'Share on WhatsApp',
    x: 'Share on X',
    email: 'Share by email',
    native: 'Share…',
    copy: 'Copy link',
    copied: 'Copied!',
  },
};

/**
 * HANDOFF §8: Facebook/WhatsApp/X/correo son botones de compartir de
 * verdad -- abren la plataforma con la página precargada, no publican
 * nada solos. Instagram y TikTok NO tienen una URL de intención de
 * compartir para ligas arbitrarias (no existe un
 * `instagram.com/share?url=` equivalente al de Facebook) -- la única vía
 * real hacia esas dos es la hoja nativa del teléfono (`navigator.share`,
 * abajo) o pegar la liga a mano, que es justo lo que hace "Copiar liga".
 */
export function ShareButtons({ url, title, tourName, locale }: { url: string; title: string; tourName: string; locale: Locale }) {
  const label = LABEL[locale];
  const canShareNative = useSyncExternalStore(subscribeNoop, getNativeShareSnapshot, getNativeShareServerSnapshot);
  const [copied, setCopied] = useState(false);

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const xHref = `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${url}`)}`;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
      trackShareClick('native', tourName);
    } catch {
      // El usuario cerró la hoja de compartir sin elegir nada -- no es un error real, no hay nada que reportar.
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackShareClick('copy', tourName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bloqueado (permiso, contexto no seguro) -- sin feedback falso de "copiado".
    }
  };

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
        <ShareFacebookIcon />
      </a>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={label.whatsapp}
        onClick={() => trackShareClick('whatsapp', tourName)}
      >
        <ShareWhatsAppIcon />
      </a>

      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={label.x}
        onClick={() => trackShareClick('x', tourName)}
      >
        <ShareXIcon />
      </a>

      <a href={emailHref} className={styles.button} aria-label={label.email} onClick={() => trackShareClick('email', tourName)}>
        <ShareEmailIcon />
      </a>

      {canShareNative && (
        <button type="button" className={styles.button} aria-label={label.native} onClick={handleNativeShare}>
          <ShareNativeIcon />
        </button>
      )}

      <button type="button" className={styles.button} aria-label={copied ? label.copied : label.copy} onClick={handleCopy}>
        {copied ? <ShareCopiedIcon /> : <ShareCopyLinkIcon />}
      </button>
    </div>
  );
}
