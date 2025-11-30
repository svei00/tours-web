import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StickyWhatsAppBar } from '@/components/layout/sticky-whatsapp-bar';
import { JsonLd } from '@/components/seo/json-ld';
import { travelAgencyJsonLd } from '@/lib/seo/json-ld';
import { SITE_URL } from '@/lib/seo/metadata';
import { businessName, buildThemeCss } from '@/lib/theme/css-variables';
import { bodyFont, headlineFont } from '@/lib/theme/fonts';
import { getSiteSettings } from '@/lib/sanity/queries';
import '@/styles/globals.css';

/**
 * Este segmento valida que el locale de la URL sea uno de los dos
 * soportados. El cambio de idioma real (LanguageSwitcher) ya funciona por
 * intercambio de prefijo de ruta — la negociación completa con next-intl
 * (segmentos de ruta traducidos, detección de Accept-Language) llega
 * cuando existan páginas con segmentos que de verdad se traduzcan
 * (Fase D en adelante, ver HANDOFF §6).
 */
const SUPPORTED_LOCALES = ['es', 'en'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const STICKY_WHATSAPP_MESSAGE: Record<Locale, string> = {
  es: 'Hola, quiero información sobre los tours',
  en: 'Hi, I want information about the tours',
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Sin esto, la página queda estática desde el build de Vercel y los cambios
 * publicados en Studio (WhatsApp, hero, etc.) nunca se reflejan hasta el
 * siguiente deploy. 60s = revisa Sanity de nuevo como máximo una vez por
 * minuto; el visitante de en medio sigue viendo la versión en caché al
 * instante mientras se regenera en segundo plano (ISR estándar).
 */
export const revalidate = 60;

/**
 * `defaultSeo.metaDescription` (Configuración > SEO por default) no está
 * localizado en el esquema (site-settings.ts) -- un solo valor para los
 * dos idiomas, feedback aceptado hasta que haga falta de verdad. Mientras
 * el cliente no lo llene, cae a esta copia fija en vez de dejar la
 * descripción vacía en cada página.
 */
const DEFAULT_DESCRIPTION: Record<Locale, string> = {
  es: 'Tours y experiencias curadas en Puerto Vallarta y Bahía de Banderas. Sabemos cuáles valen la pena.',
  en: 'Curated tours and experiences in Puerto Vallarta and Banderas Bay. We know which ones are worth it.',
};

/**
 * `generateMetadata` (no un `metadata` estático) porque necesita leer
 * `defaultSeo` de Sanity -- y de paso es donde vive el `title.template`
 * que heredan todas las páginas hijas vía `%s` (HANDOFF §8).
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : 'es';
  const siteSettings = await getSiteSettings();
  const description = siteSettings?.defaultSeo?.metaDescription || DEFAULT_DESCRIPTION[typedLocale];

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: businessName, template: `%s | ${businessName}` },
    description,
  };
}

type RootLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Este es el layout raíz del árbol de app/ (no hay otro layout.tsx por
 * encima). Aquí vive todo lo que HANDOFF §6 asigna a RootLayout: el
 * <html lang>, las variables de fuente, y las variables CSS de marca
 * inyectadas desde brand.ts vía buildThemeCss().
 */
export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const siteSettings = await getSiteSettings();

  return (
    <html lang={locale} className={`${headlineFont.variable} ${bodyFont.variable}`}>
      <head>
        {/* Contenido 100% calculado desde src/config/brand.ts, no de entrada de usuario. */}
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />
        {/* TravelAgency, no LocalBusiness genérico (HANDOFF §8) -- sitewide porque describe al negocio, no a una página en particular. */}
        <JsonLd data={travelAgencyJsonLd(siteSettings)} />
      </head>
      <body>
        <SiteHeader locale={typedLocale} />
        <main>
          <div id="header-sentinel" className="header-sentinel" aria-hidden="true" />
          {children}
        </main>
        <SiteFooter locale={typedLocale} />
        <StickyWhatsAppBar
          phone={siteSettings?.whatsappPrimary}
          secondaryPhone={siteSettings?.whatsappSecondary}
          primaryName={siteSettings?.whatsappPrimaryName}
          secondaryName={siteSettings?.whatsappSecondaryName}
          message={STICKY_WHATSAPP_MESSAGE[typedLocale]}
        />
      </body>
    </html>
  );
}
