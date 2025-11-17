import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { localeValue, type Locale, type TourDetail } from '@/lib/sanity/types';

import styles from './sticky-booking-bar.module.css';

function formatPrice(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Precio + WhatsApp, fija en móvil (HANDOFF §6) — el mensaje cae al genérico del tour si whatsappMessage está vacío. */
export function StickyBookingBar({
  tour,
  locale,
  whatsappPhone,
}: {
  tour: TourDetail;
  locale: Locale;
  whatsappPhone: string | null | undefined;
}) {
  const title = localeValue(tour.title, locale);
  const defaultMessage = locale === 'es' ? `Hola, quiero reservar: ${title}` : `Hi, I'd like to book: ${title}`;
  const customMessage = tour.whatsappMessage ? localeValue(tour.whatsappMessage, locale) : '';

  return (
    <div className={styles.bar}>
      <span className={styles.price}>{formatPrice(tour.priceAmount, tour.priceCurrency, locale)}</span>
      <WhatsAppButton phone={whatsappPhone} message={customMessage || defaultMessage}>
        {locale === 'es' ? 'Reservar' : 'Book now'}
      </WhatsAppButton>
    </div>
  );
}
