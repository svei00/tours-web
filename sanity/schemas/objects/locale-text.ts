import { defineField, defineType } from 'sanity';

import { LocaleFieldInput } from '../../components/locale-field-input';

/**
 * Igual que localeString pero para párrafos cortos (varias líneas, sin
 * formato enriquecido) — descripciones, no titulares.
 */
export const localeText = defineType({
  name: 'localeText',
  title: 'Párrafo (ES/EN)',
  type: 'object',
  components: { input: LocaleFieldInput },
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'text',
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
