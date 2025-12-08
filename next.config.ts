import type { NextConfig } from 'next';

/**
 * `optimizePackageImports` (HANDOFF §9, Fase J): fuerza tree-shaking a
 * nivel de import individual en vez de que el paquete completo se cuele en
 * el bundle del cliente. `@portabletext/react` se usa en cada página de
 * tour (Prose); `next-sanity` es de donde sale `groq`/`createClient` en
 * todo `src/lib/sanity/`. No resuelve el bulto grande que sí viene de
 * `@sanity/client` (ver NOTES.md, Fase J -- ese es un problema de
 * arquitectura, la clase entera no se puede partir por import), pero es
 * la mejora segura y recomendada por Next.js que no estaba puesta.
 */
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@portabletext/react', 'next-sanity'],
  },
};

export default nextConfig;
