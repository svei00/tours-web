import { defineField, defineType } from 'sanity';

import { createMinimumImageSizeValidator } from '../../lib/image-validation';

const MIN_IMAGE_LONG_EDGE_PX = 1600;

/**
 * Singleton -- contenido de /nosotros /about. El título de la página
 * ("Nosotros"/"About") sigue fijo en código (estructural, no cambia), pero
 * el texto de abajo -- la historia de curación del bróker -- ahora vive
 * aquí para que el cliente la pueda editar sin depender de un deploy.
 * Copy inicial de arranque (HANDOFF §1, posicionamiento de curación) --
 * pensado para que el cliente la pueda dejar tal cual o ajustarla, no un
 * relleno tipo "lorem ipsum".
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Nosotros',
  type: 'document',
  fields: [
    defineField({
      name: 'lead',
      title: 'Frase principal',
      description: 'La línea corta debajo del título -- una sola idea, no un párrafo.',
      type: 'localeText',
    }),
    defineField({
      name: 'body',
      title: 'Historia',
      type: 'localeBlock',
    }),
    defineField({
      name: 'image',
      title: 'Fotografía',
      description: `Opcional. Una foto real -- del equipo, de una lancha, de la bahía -- no el logo (el logo ya está en el encabezado y el pie de todas las páginas). Mínimo ${MIN_IMAGE_LONG_EDGE_PX}px de lado largo. Sin foto, la página se queda como está hoy, a una sola columna.`,
      type: 'richImage',
      validation: (Rule) => Rule.custom(createMinimumImageSizeValidator(MIN_IMAGE_LONG_EDGE_PX)),
    }),
  ],
  preview: {
    select: { media: 'image' },
    prepare({ media }) {
      return { title: 'Nosotros', media };
    },
  },
});
