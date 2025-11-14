import Link from 'next/link';
import type { ComponentProps } from 'react';

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  locale: string;
  href: string;
};

/**
 * Igual que next/link, pero antepone el locale automáticamente a rutas
 * internas — así los componentes no repiten `/${locale}` en cada link.
 * Rutas externas (empiezan distinto de "/") pasan intactas.
 */
export function LocaleLink({ locale, href, ...props }: LocaleLinkProps) {
  const targetHref = href.startsWith('/') ? `/${locale}${href}` : href;
  return <Link href={targetHref} {...props} />;
}
