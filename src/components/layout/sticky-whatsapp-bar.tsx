'use client';

import { usePathname } from 'next/navigation';

import { WhatsAppButton } from '@/components/ui/whatsapp-button';

import styles from './sticky-whatsapp-bar.module.css';

/**
 * Detecta específicamente `/{locale}/tours/{slug}` (la página de detalle
 * de un tour, no el listado ni las categorías) -- esa página ya trae su
 * propio `StickyBookingBar` (precio + WhatsApp de ESE tour), fijo al fondo
 * en el mismo lugar. Sin este chequeo, los dos quedaban exactamente
 * encima uno del otro (mismo `position:fixed; bottom:0`, mismo alto,
 * mismo z-index) -- bug real que reportó Svei: en la práctica el visitante
 * nunca veía el precio ni el botón específico del tour, solo el genérico
 * de aquí, que pintaba encima por venir después en el DOM.
 */
function isTourDetailPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  return segments[1] === 'tours' && segments.length === 3 && segments[2] !== 'categoria' && segments[2] !== 'category';
}

/**
 * Solo móvil (ver el CSS — oculta arriba de 768px). El botón de WhatsApp
 * es el elemento más importante de cada página (HANDOFF §3, principio 8),
 * así que en móvil se queda fijo al fondo en vez de esperar a que alguien
 * baje hasta el footer.
 */
export function StickyWhatsAppBar({
  phone,
  secondaryPhone,
  primaryName,
  secondaryName,
  message,
}: {
  phone: string | null | undefined;
  secondaryPhone?: string | null | undefined;
  primaryName?: string | null | undefined;
  secondaryName?: string | null | undefined;
  message: string;
}) {
  const pathname = usePathname();
  if (!phone) return null;
  if (isTourDetailPath(pathname)) return null;

  return (
    <div className={styles.bar}>
      <WhatsAppButton
        phone={phone}
        secondaryPhone={secondaryPhone}
        primaryName={primaryName}
        secondaryName={secondaryName}
        message={message}
        className={styles.button}
        menuDirection="up"
        location="sticky"
      >
        Reservar por WhatsApp
      </WhatsAppButton>
    </div>
  );
}
