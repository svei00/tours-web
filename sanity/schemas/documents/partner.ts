import { defineField, defineType } from 'sanity';

/**
 * El caso broker (HANDOFF §1): Pura Vida Travel no es dueño de las lanchas,
 * así que las fotos probablemente pertenecen a estos operadores. Los
 * últimos dos campos convierten el tema de derechos de autor en una lista
 * de verificación que vive dentro del CMS, en vez de quedar en la memoria
 * de alguien.
 */
export const partner = defineType({
  name: 'partner',
  title: 'Operador aliado',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'localeString',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'showPublicly',
      title: 'Mostrar el nombre del operador en el sitio',
      description: 'Decisión de transparencia — pendiente de confirmar con el cliente (HANDOFF §16).',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'photoPermissionOnFile',
      title: '¿Hay permiso por escrito para usar sus fotos?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'permissionNote',
      title: 'Dónde está guardado ese permiso',
      description: 'Ej: "captura de WhatsApp del 12/agosto, en la carpeta de Drive del cliente".',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
});
