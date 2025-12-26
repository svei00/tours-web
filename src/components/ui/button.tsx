import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './button.module.css';

type Variant = 'primary' | 'accent' | 'whatsapp' | 'ghost';

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string };

/**
 * El glifo oficial de WhatsApp (bocina + burbuja) en blanco -- Meta permite
 * mostrarlo en botones de contacto que de verdad llevan a un chat real
 * (wa.me), que es justo lo que hace este botón. SVG a mano en vez de una
 * librería de íconos, mismo criterio de "sin dependencias nuevas" que el
 * resto del sitio.
 */
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.086 3 3.5 8.586 3.5 15.504c0 2.54.756 4.905 2.054 6.883L3 29l6.789-2.512a12.44 12.44 0 0 0 6.215 1.68h.005c6.917 0 12.503-5.586 12.503-12.504C28.512 8.746 22.92 3.16 16.004 3Zm0 22.86h-.004a10.32 10.32 0 0 1-5.263-1.442l-.377-.224-3.918 1.451 1.043-3.82-.246-.393a10.31 10.31 0 0 1-1.58-5.529c0-5.71 4.646-10.356 10.356-10.356 2.766 0 5.365 1.079 7.32 3.037a10.28 10.28 0 0 1 3.033 7.328c0 5.71-4.646 10.356-10.364 10.356Zm5.674-7.762c-.31-.155-1.836-.905-2.12-1.01-.285-.104-.492-.155-.699.156-.207.31-.802 1.01-.983 1.217-.181.207-.362.233-.673.078-.31-.156-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.148-.181-.31-.02-.478.136-.633.14-.14.31-.362.465-.543.155-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.156-.699-1.684-.958-2.307-.252-.605-.508-.523-.699-.533l-.596-.01a1.145 1.145 0 0 0-.828.388c-.284.31-1.086 1.061-1.086 2.588 0 1.527 1.112 3.002 1.267 3.21.155.207 2.19 3.343 5.305 4.688.741.32 1.32.512 1.771.655.744.237 1.42.204 1.955.124.596-.089 1.836-.75 2.095-1.474.259-.724.259-1.345.181-1.474-.078-.13-.284-.207-.596-.362Z" />
    </svg>
  );
}

/**
 * Un solo componente para botón o link con la misma pinta — el CTA de
 * WhatsApp (HANDOFF §3, principio 8) usa `variant="whatsapp"` y siempre es
 * un link (`href="https://wa.me/..."`), nunca un botón de formulario.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', children, className, ...rest } = props;
  const fullClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  const content = (
    <>
      {variant === 'whatsapp' && <WhatsAppIcon />}
      {children}
    </>
  );

  if ('href' in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link href={href} className={fullClassName} {...anchorProps}>
        {content}
      </Link>
    );
  }

  return (
    <button className={fullClassName} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
