import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Singleton — un solo documento. El desk-structure.ts lo abre directo en
 * el editor (sin lista de por medio), y es la sección "Configuración" que
 * ve el cliente (HANDOFF §5, "UX del Studio para un cliente no técnico").
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappPrimary',
      title: 'WhatsApp principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappSecondary',
      title: 'WhatsApp secundario',
      type: 'string',
    }),
    defineField({
      name: 'phones',
      title: 'Teléfonos',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'email',
      title: 'Correo',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      description: 'Debe coincidir carácter por carácter con el Perfil de Empresa en Google (HANDOFF §8).',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Calle y número', type: 'string' }),
        defineField({ name: 'city', title: 'Ciudad', type: 'string' }),
        defineField({ name: 'state', title: 'Estado', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Código postal', type: 'string' }),
        defineField({ name: 'country', title: 'País', type: 'string', initialValue: 'México' }),
        defineField({
          name: 'geo',
          title: 'Coordenadas',
          description: 'Necesarias para el schema.org de LocalBusiness/TravelAgency.',
          type: 'geopoint',
        }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Horario',
      type: 'string',
    }),
    defineField({
      name: 'googleBusinessProfileUrl',
      title: 'Liga al Perfil de Empresa en Google',
      type: 'url',
    }),
    defineField({ name: 'facebookUrl', title: 'Facebook', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram', type: 'url' }),
    defineField({ name: 'tiktokUrl', title: 'TikTok', type: 'url' }),
    defineField({
      name: 'heroHeadline',
      title: 'Titular del hero',
      type: 'localeString',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Subtítulo del hero',
      type: 'localeString',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Fotos del carrusel principal',
      description: 'Máximo 5 diapositivas (HANDOFF §6).',
      type: 'array',
      of: [defineArrayMember({ type: 'richImage' })],
      validation: (Rule) => Rule.max(5).error('Máximo 5 diapositivas.'),
    }),
    defineField({
      name: 'reviewsSectionVisible',
      title: 'Mostrar la sección de reseñas',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'defaultSeo',
      title: 'SEO por default',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Título para buscadores', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Descripción para buscadores', type: 'text' }),
        defineField({ name: 'ogImage', title: 'Imagen para compartir en redes', type: 'image' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuración del sitio' };
    },
  },
});
