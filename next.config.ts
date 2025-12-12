import type { NextConfig } from 'next';

/**
 * `optimizePackageImports` (HANDOFF §9, Fase J): fuerza tree-shaking a
 * nivel de import individual en vez de que el paquete completo se cuele en
 * el bundle del cliente. `@portabletext/react` se usa en cada página de
 * tour (Prose); `next-sanity` es de donde sale `groq`/`createClient` en
 * todo `src/lib/sanity/`.
 *
 * El bulto grande de `@sanity/client` (lectura Y escritura completas, el
 * causante real de que el bundle público se saliera del presupuesto de
 * 120KB de HANDOFF §9) ya no es un problema de arquitectura sin resolver
 * -- era una sola ruta de import: `rich-image.tsx` ('use client') pedía
 * `sanityClient` completo desde `image-loader.ts` solo para construir URLs
 * de imagen. `@sanity/image-url` acepta `{ projectId, dataset }` sueltos
 * en vez del cliente entero, así que con ese cambio (ver
 * `src/lib/sanity/image-loader.ts`) `next-sanity` se quedó sin ninguna
 * ruta hacia código de cliente y el bundle del navegador dejó de cargarlo.
 */
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@portabletext/react', 'next-sanity'],
  },
};

export default nextConfig;
