import { WhatsAppButton } from '@/components/ui/whatsapp-button';

import styles from './sticky-whatsapp-bar.module.css';

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
  if (!phone) return null;

  return (
    <div className={styles.bar}>
      <WhatsAppButton
        phone={phone}
        secondaryPhone={secondaryPhone}
        primaryName={primaryName}
        secondaryName={secondaryName}
        message={message}
        className={styles.button}
      >
        Reservar por WhatsApp
      </WhatsAppButton>
    </div>
  );
}
