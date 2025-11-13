import { defineField, defineType } from 'sanity';

/**
 * Una imagen con recorte dirigido (hotspot) y texto alternativo obligatorio
 * en español — accesibilidad y SEO, no opcional (HANDOFF §5). El tamaño
 * mínimo NO se valida aquí: hero y galería exigen mínimos distintos
 * (2400px vs 1600px), así que esa validación vive en el documento que usa
 * cada campo (ver sanity/lib/image-validation.ts).
 */
export const richImage = defineType({
  name: 'richImage',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      description: 'Describe la foto en español. Obligatorio: accesibilidad y SEO.',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Descripción (opcional)',
      type: 'localeString',
    }),
  ],
});
