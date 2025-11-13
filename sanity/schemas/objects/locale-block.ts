import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Texto enriquecido (párrafos, listas, negritas) en dos idiomas. Sin botón
 * de traducir a propósito: DeepL traduce bien lo factual pero mal la voz de
 * venta, y aquí es justo donde vive la voz de venta (HANDOFF §5, "El botón
 * de traducir" — advertencia realista). El inglés se escribe a mano.
 */
export const localeBlock = defineType({
  name: 'localeBlock',
  title: 'Texto enriquecido (ES/EN)',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'enIsMachineDraft',
      title: 'Traducción automática sin revisar',
      type: 'boolean',
      initialValue: false,
      hidden: true,
    }),
  ],
});
