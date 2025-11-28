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
      title: 'WhatsApp principal *',
      description: 'Solo dígitos, con código de país, sin "+", espacios ni guiones.',
      type: 'string',
      placeholder: 'Ej. 523222783261',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatsappPrimaryName',
      title: 'Nombre de quién atiende el WhatsApp principal',
      description: 'Solo se usa si también llenas el WhatsApp secundario — deja elegir a quién escribirle.',
      type: 'string',
      placeholder: 'Ej. Ventas',
    }),
    defineField({
      name: 'whatsappSecondary',
      title: 'WhatsApp secundario',
      description: 'Solo dígitos, con código de país, sin "+", espacios ni guiones.',
      type: 'string',
      placeholder: 'Ej. 523222783261',
    }),
    defineField({
      name: 'whatsappSecondaryName',
      title: 'Nombre de quién atiende el WhatsApp secundario',
      type: 'string',
      placeholder: 'Ej. Reservaciones',
    }),
    defineField({
      name: 'phones',
      title: 'Teléfonos',
      description: 'Para mostrar en el sitio (no son ligas de WhatsApp). Formato libre, ej. +52 322 278 3261.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'email',
      title: 'Correo *',
      type: 'string',
      placeholder: 'Ej. contacto@puravidatravel.mx',
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
      name: 'foundedYear',
      title: 'Año en que empezó a operar',
      description: 'Para el "años operando" del trust strip del home — se resta contra el año actual.',
      type: 'number',
    }),
    defineField({
      name: 'googleBusinessProfileUrl',
      title: 'Liga al Perfil de Empresa en Google',
      type: 'url',
    }),
    defineField({ name: 'facebookUrl', title: 'Facebook', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram', type: 'url' }),
    defineField({ name: 'tiktokUrl', title: 'TikTok', type: 'url' }),
    defineField({ name: 'youtubeUrl', title: 'YouTube', type: 'url' }),
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
