import Image from 'next/image';

/**
 * El ícono de marca — corte transversal de nautilus, arte aprobado por el
 * cliente en reference/nautilus/marca-nautilus-arena.png (esa carpeta está
 * en .gitignore por ser material de trabajo; la versión que sí se sube al
 * repo y se sirve en el sitio es este PNG ya redimensionado en
 * public/brand/nautilus-mark.png).
 *
 * `size` es el lado en px que de verdad se le pide al optimizador de
 * Next.js — no se manda el PNG de 220px completo y se encoge por CSS,
 * porque eso desperdicia bytes en una audiencia que vive en el celular
 * (HANDOFF §9).
 */
export function NautilusMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/nautilus-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
}
