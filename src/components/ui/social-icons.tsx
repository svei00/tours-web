/**
 * Glifos a mano en `currentColor`, mismo criterio que WhatsAppIcon en
 * button.tsx: nada de librería de íconos, y así heredan el color/hover
 * de quien los use sin CSS extra. Solo los cuatro que siteSettings ya
 * modela (facebookUrl, instagramUrl, tiktokUrl, youtubeUrl) -- el Perfil
 * de Google se queda como liga de texto, no es una red social.
 */

type IconProps = { size?: number };

export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
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

export function YoutubeIcon({ size = 20 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.92C18.05 5.3 12 5.3 12 5.3s-6.05 0-7.7.48A2.7 2.7 0 0 0 2.4 7.7 28.3 28.3 0 0 0 1.9 12a28.3 28.3 0 0 0 .5 4.3 2.7 2.7 0 0 0 1.9 1.92c1.65.48 7.7.48 7.7.48s6.05 0 7.7-.48a2.7 2.7 0 0 0 1.9-1.92 28.3 28.3 0 0 0 .5-4.3 28.3 28.3 0 0 0-.5-4.3ZM9.9 15.02V8.98L15.4 12l-5.5 3.02Z" />
    </svg>
  );
}
