import { defineField, defineType } from 'sanity';

import { LocaleFieldInput } from '../../components/locale-field-input';

/**
 * Una sola línea de texto en dos idiomas. Español es obligatorio; el sitio
 * nunca renderiza un campo en blanco, así que inglés vacío cae de vuelta al
 * español en las consultas del frontend (HANDOFF §5, regla 2) — eso pasa en
 * las queries de Sanity, no aquí.
 */
export const localeString = defineType({
  name: 'localeString',
  title: 'Texto (ES/EN)',
  type: 'object',
  components: { input: LocaleFieldInput },
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'string',
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
