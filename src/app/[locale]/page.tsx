import { ContactCTA } from '@/components/home/contact-cta';
import { CurationSection } from '@/components/home/curation-section';
import { FeaturedTours } from '@/components/home/featured-tours';
import { HeroCarousel } from '@/components/home/hero-carousel';
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
 * Se arma sección por sección: todo lo de Fase E ya está aquí excepto
 * ReviewsBand y PromoBanner, que dependen de los interruptores de
 * visibilidad de reseñas/promociones -- eso es trabajo de Fase F, no de
 * esta (HANDOFF §14).
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
        locale={typedLocale}
      />
      <TrustStrip locale={typedLocale} />
      <FeaturedTours locale={typedLocale} />
      <CurationSection locale={typedLocale} />
      <VerticalVideoStrip locale={typedLocale} />
      <ContactCTA locale={typedLocale} />
    </>
  );
}
