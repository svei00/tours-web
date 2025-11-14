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
 * Un solo componente para botón o link con la misma pinta — el CTA de
 * WhatsApp (HANDOFF §3, principio 8) usa `variant="whatsapp"` y siempre es
 * un link (`href="https://wa.me/..."`), nunca un botón de formulario.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', children, className, ...rest } = props;
  const fullClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  if ('href' in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link href={href} className={fullClassName} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={fullClassName} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
