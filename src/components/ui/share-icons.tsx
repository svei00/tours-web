/**
 * Glifos a mano para `ShareButtons`, separados de `social-icons.tsx` a
 * propósito (mismo criterio que el WhatsApp de `button.tsx`: ese archivo
 * es la API pública de íconos para el footer, este es un detalle interno
 * de compartir). La razón real: aquí necesitan un tratamiento distinto —
 * cada uno es una insignia autocontenida (círculo de color de marca +
 * glifo blanco encima), no un trazo que herede `currentColor` como en el
 * footer.
 *
 * HANDOFF §8, "Alineación de los íconos — la causa real, medida": el hueco
 * entre Facebook y WhatsApp no era un ícono faltante, era que el glifo de
 * Facebook llenaba 39% de su viewBox contra 80% del de WhatsApp -- mismo
 * tamaño de render, peso óptico muy distinto. La regla que corrige esto de
 * raíz: **el círculo de fondo de cada insignia siempre toca los cuatro
 * bordes de su propio viewBox**, así que renderizadas al mismo `size`
 * quedan con el mismo diámetro exacto sin importar cómo esté dibujado el
 * glifo de encima.
 */

type IconProps = { size?: number };

export function ShareFacebookIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.117 3H13.5C11.015 3 9 5.015 9 7.5V9.75H6.75a.375.375 0 0 0-.375.375v3a.375.375 0 0 0 .375.375H9V21h3.75v-7.5h2.273a.375.375 0 0 0 .372-.325l.375-3a.375.375 0 0 0-.372-.425H12.75V7.5c0-.621.504-1.125 1.125-1.125h1.242a.375.375 0 0 0 .375-.375V3.375A.375.375 0 0 0 15.117 3Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Mismo glifo oficial que el resto del sitio (button.tsx, social-icons.tsx)
 * -- viewBox propio 0 0 32 32, se duplica en vez de importarse por el
 * mismo motivo que esos dos.
 *
 * A diferencia de Facebook/X (un glifo pequeño flotando en el disco), el
 * contorno de la "burbuja" de WhatsApp ES casi un círculo completo por sí
 * solo (ocupa ~80% del viewBox) -- puesto tal cual sobre un disco del
 * mismo diámetro, casi no quedaba margen de color visible alrededor, y se
 * veía desproporcionado contra el resto de la fila (Svei lo reportó como
 * "raro"). El `transform` del `<path>` de abajo encoge el glifo ~28% y lo
 * recentra, dejando el mismo margen de aire que los demás.
 */
export function ShareWhatsAppIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="var(--color-whatsapp)" />
      <path
        d="M16.004 3C9.086 3 3.5 8.586 3.5 15.504c0 2.54.756 4.905 2.054 6.883L3 29l6.789-2.512a12.44 12.44 0 0 0 6.215 1.68h.005c6.917 0 12.503-5.586 12.503-12.504C28.512 8.746 22.92 3.16 16.004 3Zm0 22.86h-.004a10.32 10.32 0 0 1-5.263-1.442l-.377-.224-3.918 1.451 1.043-3.82-.246-.393a10.31 10.31 0 0 1-1.58-5.529c0-5.71 4.646-10.356 10.356-10.356 2.766 0 5.365 1.079 7.32 3.037a10.28 10.28 0 0 1 3.033 7.328c0 5.71-4.646 10.356-10.364 10.356Zm5.674-7.762c-.31-.155-1.836-.905-2.12-1.01-.285-.104-.492-.155-.699.156-.207.31-.802 1.01-.983 1.217-.181.207-.362.233-.673.078-.31-.156-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.148-.181-.31-.02-.478.136-.633.14-.14.31-.362.465-.543.155-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.156-.699-1.684-.958-2.307-.252-.605-.508-.523-.699-.533l-.596-.01a1.145 1.145 0 0 0-.828.388c-.284.31-1.086 1.061-1.086 2.588 0 1.527 1.112 3.002 1.267 3.21.155.207 2.19 3.343 5.305 4.688.741.32 1.32.512 1.771.655.744.237 1.42.204 1.955.124.596-.089 1.836-.75 2.095-1.474.259-.724.259-1.345.181-1.474-.078-.13-.284-.207-.596-.362Z"
        fill="#FFFFFF"
        transform="translate(16 16) scale(0.72) translate(-16 -16)"
      />
    </svg>
  );
}

/** Fondo negro -- así se ve el ícono oficial de X (antes Twitter) en la práctica, no un azul heredado del rebrand viejo. */
export function ShareXIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#000000" />
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#FFFFFF"
        transform="translate(12 12) scale(0.72) translate(-12 -12)"
      />
    </svg>
  );
}

/** Sin marca de terceros -- correo usa el color primario del sitio, no un color de plataforma. */
export function ShareEmailIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-primary-500)" />
      <rect x="5.5" y="7.5" width="13" height="9.5" rx="1.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M6 8.2l6 4.4 6-4.4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Glifo estilo "subir a la bandeja" (el mismo lenguaje visual que el ícono
 * nativo de compartir de iOS/Android) -- primario, no gris, porque
 * funcionalmente es el botón más importante de la fila: es la única vía
 * real hacia Instagram y TikTok (HANDOFF §8).
 */
export function ShareNativeIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-primary-500)" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15V5" />
        <path d="M8.2 8.8 12 5l3.8 3.8" />
        <path d="M6.5 12v5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-5" />
      </g>
    </svg>
  );
}

/** Ícono de cadena/liga, en `muted` -- deliberadamente menos protagónico que los botones de marca, es la acción de utilidad, no una plataforma. */
export function ShareCopyLinkIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-muted)" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round">
        <path d="M10.3 13.7l3.4-3.4" />
        <path d="M12.1 8.4l1.3-1.3a2.6 2.6 0 0 1 3.7 3.7L15.8 12" />
        <path d="M11.9 15.6l-1.3 1.3a2.6 2.6 0 0 1-3.7-3.7L8.2 12" />
      </g>
    </svg>
  );
}

/** Confirmación visual al copiar (HANDOFF §8) -- reemplaza el ícono de liga un momento. */
export function ShareCopiedIcon({ size = 22 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-primary-500)" />
      <path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
