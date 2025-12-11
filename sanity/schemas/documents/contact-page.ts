import { defineField, defineType } from 'sanity';

/**
 * Singleton -- contenido de /contacto /contact. A propósito NO tiene un
 * formulario: el cliente rechazó eso explícitamente, la conversión pasa
 * por WhatsApp. Este documento solo guarda el texto de introducción --
 * los datos de contacto reales (teléfonos, correo, dirección, horario)
 * siguen viviendo en `siteSettings`, un solo lugar, sin duplicar.
 */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contacto',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Texto de introducción',
      description: 'Invita a escribir por WhatsApp -- los datos de contacto ya se muestran solos, tomados de Configuración.',
      type: 'localeText',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contacto' };
    },
  },
});
