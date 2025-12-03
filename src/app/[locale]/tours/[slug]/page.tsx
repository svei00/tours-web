import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { StickyBookingBar } from '@/components/tour/sticky-booking-bar';
import { TourDescription } from '@/components/tour/tour-description';
import { TourFacts } from '@/components/tour/tour-facts';
import { TourGallery } from '@/components/tour/tour-gallery';
import { TourHero } from '@/components/tour/tour-hero';
import { TourVideos } from '@/components/tour/tour-videos';
import { TourViewTracker } from '@/components/tour/tour-view-tracker';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ShareButtons } from '@/components/ui/share-buttons';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbListJsonLd, touristTripJsonLd } from '@/lib/seo/json-ld';
import { buildAlternates, LOCALIZED_PATHS, ogImageUrl, SITE_URL } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/sanity/queries';
import { getTourBySlug } from '@/lib/sanity/tours';
import { localeValue, tourSlugFor, type Locale } from '@/lib/sanity/types';

import styles from './page.module.css';

const BREADCRUMB_HOME: Record<Locale, string> = { es: 'Inicio', en: 'Home' };
const BREADCRUMB_TOURS: Record<Locale, string> = { es: 'Tours', en: 'Tours' };

/**
 * La página que vende (HANDOFF §6). Sin generateStaticParams a propósito:
 * los tours cambian por el Studio, así que se renderiza en cada visita en
 * vez de precalcularse en build — el ISR/cache real es un ajuste de
 * rendimiento de la Fase J, no algo que haga falta hoy.
 */
type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};

  const typedLocale = locale as Locale;
  const title = localeValue(tour.title, typedLocale);
  const description = localeValue(tour.shortDescription, typedLocale);
  const image = ogImageUrl(tour.heroImage);

  return {
    title,
    description,
    alternates: buildAlternates(typedLocale, `/tours/${tour.slugEs}`, `/tours/${tour.slugEn}`),
    ...(image && { openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] } }),
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;

  const [tour, siteSettings] = await Promise.all([getTourBySlug(slug), getSiteSettings()]);
  if (!tour) notFound();

  const pageUrl = `${SITE_URL}/${typedLocale}/tours/${tourSlugFor(tour, typedLocale)}`;
  const toursListUrl = `${SITE_URL}/${typedLocale}${LOCALIZED_PATHS.tours[typedLocale]}`;
  const tourName = localeValue(tour.title, typedLocale);

  return (
    <>
      <TourViewTracker tourName={tourName} locale={typedLocale} />
      <JsonLd data={touristTripJsonLd(tour, typedLocale, pageUrl)} />
      <JsonLd
        data={breadcrumbListJsonLd([
          { name: BREADCRUMB_HOME[typedLocale], url: `${SITE_URL}/${typedLocale}` },
          { name: BREADCRUMB_TOURS[typedLocale], url: toursListUrl },
          { name: tourName, url: pageUrl },
        ])}
      />
      <TourHero tour={tour} locale={typedLocale} />
      <Section>
        <Container>
          <div className={styles.main}>
            <TourGallery images={tour.gallery} locale={typedLocale} tourName={tourName} />
            <TourDescription tour={tour} locale={typedLocale} />
            <ShareButtons url={pageUrl} title={tourName} tourName={tourName} locale={typedLocale} />
            <TourFacts tour={tour} locale={typedLocale} />
            <TourVideos videos={tour.videos} locale={typedLocale} tourName={tourName} />
          </div>
        </Container>
      </Section>
      <StickyBookingBar
        tour={tour}
        locale={typedLocale}
        whatsappPhone={siteSettings?.whatsappPrimary}
        whatsappSecondaryPhone={siteSettings?.whatsappSecondary}
        whatsappPrimaryName={siteSettings?.whatsappPrimaryName}
        whatsappSecondaryName={siteSettings?.whatsappSecondaryName}
      />
    </>
  );
}
