import { Prose } from '@/components/ui/prose';
import type { Locale, TourDetail } from '@/lib/sanity/types';

export function TourDescription({ tour, locale }: { tour: TourDetail; locale: Locale }) {
  const blocks = locale === 'en' && tour.longDescription?.en ? tour.longDescription.en : tour.longDescription?.es;
  return <Prose value={blocks} />;
}
