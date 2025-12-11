import { defineField, defineType } from 'sanity';

/**
 * Una sección numerada de un documento legal (privacidad/términos). El
 * número ("1.", "2.") no se guarda aquí -- se calcula solo por la posición
 * en el arreglo al renderizar, así el cliente puede reordenar secciones en
 * el Studio sin tener que reescribir números a mano en cada título.
 */
export const legalSection = defineType({
  name: 'legalSection',
  title: 'Sección',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Título de la sección',
      description: 'Sin numerar -- el número se agrega solo según el orden.',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'localeBlock',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading.es' },
  },
});
