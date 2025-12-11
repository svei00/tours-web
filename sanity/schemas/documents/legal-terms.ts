import { defineArrayMember, defineField, defineType } from 'sanity';

/** Singleton -- Términos y condiciones (HANDOFF §11). Mismo criterio que legalPrivacy: ver ese archivo para el porqué de `updatedAt`. */
export const legalTerms = defineType({
  name: 'legalTerms',
  title: 'Términos y condiciones',
  type: 'document',
  fields: [
    defineField({
      name: 'updatedAt',
      title: 'Fecha de vigencia',
      description:
        'Mientras este campo esté vacío, la página se queda fuera de buscadores (noindex) y muestra un aviso de borrador. Llénalo cuando el contenido esté listo para publicarse de verdad.',
      type: 'date',
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      of: [defineArrayMember({ type: 'legalSection' })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { updatedAt: 'updatedAt' },
    prepare({ updatedAt }) {
      return { title: 'Términos y condiciones', subtitle: updatedAt ? `Vigente desde ${updatedAt}` : 'Borrador -- sin publicar' };
    },
  },
});
