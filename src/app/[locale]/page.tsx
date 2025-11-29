import { ContactCTA } from '@/components/home/contact-cta';
import { CurationSection } from '@/components/home/curation-section';
import { FeaturedTours } from '@/components/home/featured-tours';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { PromoBanner } from '@/components/home/promo-banner';
import { ReviewsBand } from '@/components/home/reviews-band';
import { TrustStrip } from '@/components/home/trust-strip';
import { VerticalVideoStrip } from '@/components/home/vertical-video-strip';
import { getSiteSettings } from '@/lib/sanity/queries';
import type { Locale } from '@/lib/sanity/types';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Home real (HANDOFF §6 y §14, Fase E). Reemplaza la página de
 * verificación de tokens de la Fase A — esa ya cumplió su función (ver
 * NOTES.md, Fase A) y HANDOFF nunca pidió conservarla como ruta.
 *
 * Se arma sección por sección. ReviewsBand y PromoBanner llegaron en Fase
 * F (HANDOFF §14) -- cada una se oculta sola cuando no hay nada que
 * mostrar (sin reseñas destacadas, sin promoción activa), mismo trato que
 * el resto de las secciones de Fase E.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const siteSettings = await getSiteSettings();

  return (
    <>
      <HeroCarousel
        slides={siteSettings?.heroSlides ?? []}
        headline={siteSettings?.heroHeadline ?? null}
        subheadline={siteSettings?.heroSubheadline ?? null}
        whatsappPhone={siteSettings?.whatsappPrimary}
        whatsappSecondaryPhone={siteSettings?.whatsappSecondary}
        whatsappPrimaryName={siteSettings?.whatsappPrimaryName}
        whatsappSecondaryName={siteSettings?.whatsappSecondaryName}
        scrimEnabled={siteSettings?.heroScrimEnabled}
        locale={typedLocale}
      />
      <TrustStrip locale={typedLocale} />
      <FeaturedTours locale={typedLocale} />
      <CurationSection locale={typedLocale} />
      <VerticalVideoStrip locale={typedLocale} />
      <PromoBanner locale={typedLocale} />
      <ReviewsBand locale={typedLocale} />
      <ContactCTA locale={typedLocale} />
    </>
  );
}
