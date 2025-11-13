import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `endDate` es obligatorio a propósito: una "oferta por tiempo limitado"
 * que sigue ahí ocho meses después destruye la confianza (HANDOFF §5). El
 * ocultamiento automático en sí lo hace la consulta del frontend
 * (`endDate > ahora`) cuando se construyan las páginas que la muestran —
 * este esquema solo garantiza que la fecha siempre exista.
 */
export const promotion = defineType({
  name: 'promotion',
  title: 'Promoción',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeText',
    }),
    defineField({
      name: 'badgeText',
      title: 'Texto de la insignia',
      description: 'Ej: "2x1", "Oferta de agosto"',
      type: 'localeString',
    }),
    defineField({
      name: 'appliesTo',
      title: 'Aplica a',
      description: 'Deja vacío para que aplique a todos los tours.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tour' }] })],
    }),
    defineField({
      name: 'startDate',
      title: 'Empieza',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'Termina',
      description: 'Obligatoria — así la promoción se oculta sola cuando pase la fecha.',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visible',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title.es', endDate: 'endDate' },
    prepare({ title, endDate }) {
      return {
        title,
        subtitle: endDate ? `Termina: ${endDate}` : 'Sin fecha de fin',
      };
    },
  },
});
