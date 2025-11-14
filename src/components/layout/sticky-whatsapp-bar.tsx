import { WhatsAppButton } from '@/components/ui/whatsapp-button';

import styles from './sticky-whatsapp-bar.module.css';

/**
 * Solo móvil (ver el CSS — oculta arriba de 768px). El botón de WhatsApp
 * es el elemento más importante de cada página (HANDOFF §3, principio 8),
 * así que en móvil se queda fijo al fondo en vez de esperar a que alguien
 * baje hasta el footer.
 */
export function StickyWhatsAppBar({ phone, message }: { phone: string | null | undefined; message: string }) {
  if (!phone) return null;

  return (
    <div className={styles.bar}>
      <WhatsAppButton phone={phone} message={message} className={styles.button}>
        Reservar por WhatsApp
      </WhatsAppButton>
    </div>
  );
}
