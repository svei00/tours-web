import { defineField, defineType } from 'sanity';

/**
 * Sin campos localeString/localeText a propósito: las reseñas NO se
 * traducen (HANDOFF §5). Traducir el testimonio de alguien cambia lo que
 * esa persona dijo, y las reseñas en idiomas mezclados son en sí mismas
 * una señal de confianza — demuestran clientes internacionales reales.
 */
export const review = defineType({
  name: 'review',
  title: 'Reseña',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorLocation',
      title: 'Lugar de origen',
      description: 'Ej: "Guadalajara, México" — sube credibilidad.',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Fuente',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Directo', value: 'directo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Liga a la reseña original',
      description: 'Cuando exista — mantiene la reseña creíble.',
      type: 'url',
    }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'quote',
      title: 'Texto de la reseña',
      description: 'Tal como la persona lo escribió — no se traduce.',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Idioma del texto',
      description: 'Define el atributo de idioma del bloque en la página.',
      type: 'string',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'Inglés', value: 'en' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Fecha',
      type: 'date',
    }),
    defineField({
      name: 'relatedTour',
      title: 'Tour relacionado',
      type: 'reference',
      to: [{ type: 'tour' }],
    }),
    defineField({
      name: 'visible',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Aparece en el home',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'quote', visible: 'visible' },
    prepare({ title, subtitle, visible }) {
      return {
        title,
        subtitle: visible ? subtitle : `(oculta) ${subtitle}`,
      };
    },
  },
});
