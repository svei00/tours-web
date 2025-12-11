import { defineField, defineType } from 'sanity';

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
  ],
  preview: {
    prepare() {
      return { title: 'Nosotros' };
    },
  },
});
