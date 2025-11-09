import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';

import { businessName, buildThemeCss } from '@/lib/theme/css-variables';
import { bodyFont, headlineFont } from '@/lib/theme/fonts';
import '@/styles/globals.css';

/**
 * i18n real (next-intl, mensajes, cambio de idioma) llega en la Fase C.
 * Por ahora este segmento solo valida que el locale de la URL sea uno
 * de los dos soportados, para que la estructura de rutas de HANDOFF §6
 * (/es, /en) exista desde la Fase A sin construir todavía la lógica de
 * traducción completa.
 */
const SUPPORTED_LOCALES = ['es', 'en'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

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

  return (
    <html lang={locale} className={`${headlineFont.variable} ${bodyFont.variable}`}>
      <head>
        {/* Contenido 100% calculado desde src/config/brand.ts, no de entrada de usuario. */}
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
