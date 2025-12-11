import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Singleton -- Aviso de privacidad (HANDOFF §11, LFPDPPP). Antes vivía como
 * texto fijo en src/components/misc/privacy-page.tsx; el cliente pidió
 * poder editarlo sin depender de un cambio de código.
 *
 * `updatedAt` es el único interruptor real: mientras esté vacío, la página
 * sigue en `noindex` y muestra el aviso de "borrador" -- exactamente el
 * mismo criterio que `hidden` en tour/review (Fase K, "publicar tiene que
 * significar publicado"): un solo campo, sin ambigüedad, en vez de que el
 * código intente adivinar si el contenido "ya está listo" revisando texto
 * suelto entre corchetes.
 */
export const legalPrivacy = defineType({
  name: 'legalPrivacy',
  title: 'Aviso de privacidad',
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
      return { title: 'Aviso de privacidad', subtitle: updatedAt ? `Vigente desde ${updatedAt}` : 'Borrador -- sin publicar' };
    },
  },
});
