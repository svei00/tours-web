import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_LOCALE = 'es';

/**
 * Redirige la raíz del sitio (sin prefijo de idioma) al locale por defecto,
 * para que la URL que se comparte con el cliente no tire 404. La
 * negociación real de idioma (Accept-Language del navegador, selector,
 * cookie de preferencia) llega con next-intl en la Fase C — esto es
 * deliberadamente lo mínimo posible mientras tanto.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/',
};
