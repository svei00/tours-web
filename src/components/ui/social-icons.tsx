/**
 * Glifos a mano, nada de librería de íconos (mismo criterio que
 * WhatsAppIcon en button.tsx). Solo los cuatro que siteSettings ya modela
 * (facebookUrl, instagramUrl, tiktokUrl, youtubeUrl) -- el Perfil de
 * Google se queda como liga de texto, no es una red social.
 *
 * Facebook y YouTube van en su color oficial fijo (feedback de Svei: se
 * pierden con el resto del texto del footer si heredan `currentColor`).
 * Instagram y TikTok se quedan en `currentColor` -- Instagram no tiene un
 * solo color de marca real (su gradiente no se puede replicar con un
 * SVG de un solo `fill`), y el logo de TikTok en un solo color pierde el
 * splitting cian/rojo que lo hace reconocible -- para los dos, heredar el
 * color del texto del link se ve mejor que forzar una aproximación.
 */

type IconProps = { size?: number };

/**
 * `fill` a un hex fijo, no `currentColor` -- a diferencia de Instagram/
 * TikTok (que sí heredan el color del link y cambian en hover), el color
 * de marca de Facebook/YouTube es parte de reconocer el ícono, así que se
 * queda igual sin importar hover ni dónde se use (mismo criterio que el
 * verde de WhatsApp en button.tsx, reservado y fijo). `#1877F2` es el azul
 * oficial de Facebook.
 */
export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#1877F2" aria-hidden="true">
      <path d="M15.117 3H13.5C11.015 3 9 5.015 9 7.5V9.75H6.75a.375.375 0 0 0-.375.375v3a.375.375 0 0 0 .375.375H9V21h3.75v-7.5h2.273a.375.375 0 0 0 .372-.325l.375-3a.375.375 0 0 0-.372-.425H12.75V7.5c0-.621.504-1.125 1.125-1.125h1.242a.375.375 0 0 0 .375-.375V3.375A.375.375 0 0 0 15.117 3Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3h-2.75v11.9a2.6 2.6 0 1 1-1.9-2.505v-2.79a5.4 5.4 0 1 0 4.65 5.35V9.03a6.9 6.9 0 0 0 4 1.28V7.56a4.15 4.15 0 0 1-3.16-1.44A4.14 4.14 0 0 1 16.5 3Z" />
    </svg>
  );
}

/** Mismo criterio que FacebookIcon arriba -- `#FF0000` es el rojo oficial de YouTube, fijo, no heredado. */
export function YoutubeIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF0000" aria-hidden="true">
      <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.92C18.05 5.3 12 5.3 12 5.3s-6.05 0-7.7.48A2.7 2.7 0 0 0 2.4 7.7 28.3 28.3 0 0 0 1.9 12a28.3 28.3 0 0 0 .5 4.3 2.7 2.7 0 0 0 1.9 1.92c1.65.48 7.7.48 7.7.48s6.05 0 7.7-.48a2.7 2.7 0 0 0 1.9-1.92 28.3 28.3 0 0 0 .5-4.3 28.3 28.3 0 0 0-.5-4.3ZM9.9 15.02V8.98L15.4 12l-5.5 3.02Z" />
    </svg>
  );
}

/** Mismo glifo oficial que WhatsAppIcon en button.tsx -- se duplica aquí (viewBox propio, 0 0 32 32) en vez de exportarlo desde ahí porque ese archivo lo trata como un detalle interno del botón, no como parte de la API pública de íconos. */
export function WhatsappIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.004 3C9.086 3 3.5 8.586 3.5 15.504c0 2.54.756 4.905 2.054 6.883L3 29l6.789-2.512a12.44 12.44 0 0 0 6.215 1.68h.005c6.917 0 12.503-5.586 12.503-12.504C28.512 8.746 22.92 3.16 16.004 3Zm0 22.86h-.004a10.32 10.32 0 0 1-5.263-1.442l-.377-.224-3.918 1.451 1.043-3.82-.246-.393a10.31 10.31 0 0 1-1.58-5.529c0-5.71 4.646-10.356 10.356-10.356 2.766 0 5.365 1.079 7.32 3.037a10.28 10.28 0 0 1 3.033 7.328c0 5.71-4.646 10.356-10.364 10.356Zm5.674-7.762c-.31-.155-1.836-.905-2.12-1.01-.285-.104-.492-.155-.699.156-.207.31-.802 1.01-.983 1.217-.181.207-.362.233-.673.078-.31-.156-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.148-.181-.31-.02-.478.136-.633.14-.14.31-.362.465-.543.155-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.156-.699-1.684-.958-2.307-.252-.605-.508-.523-.699-.533l-.596-.01a1.145 1.145 0 0 0-.828.388c-.284.31-1.086 1.061-1.086 2.588 0 1.527 1.112 3.002 1.267 3.21.155.207 2.19 3.343 5.305 4.688.741.32 1.32.512 1.771.655.744.237 1.42.204 1.955.124.596-.089 1.836-.75 2.095-1.474.259-.724.259-1.345.181-1.474-.078-.13-.284-.207-.596-.362Z" />
    </svg>
  );
}
