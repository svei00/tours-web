import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { StickyWhatsAppBar } from '@/components/layout/sticky-whatsapp-bar';
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

export const metadata: Metadata = {
  title: businessName,
};

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
      </head>
      <body>
        <SiteHeader locale={typedLocale} />
        <main>
          <div id="header-sentinel" className="header-sentinel" aria-hidden="true" />
          {children}
        </main>
        <SiteFooter locale={typedLocale} />
        <StickyWhatsAppBar phone={siteSettings?.whatsappPrimary} message={STICKY_WHATSAPP_MESSAGE[typedLocale]} />
      </body>
    </html>
  );
}
