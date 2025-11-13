import { defineArrayMember, defineField, defineType } from 'sanity';

import { createMinimumImageSizeValidator } from '../../lib/image-validation';

const MIN_HERO_LONG_EDGE_PX = 2400;
const MIN_GALLERY_LONG_EDGE_PX = 1600;
const MIN_GALLERY_IMAGES = 4;
const RECOMMENDED_GALLERY_IMAGES = 8;
const MAX_SHORT_DESCRIPTION_CHARS = 160;

export const tour = defineType({
  name: 'tour',
  title: 'Tour',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del tour',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slugEs',
      title: 'URL en español',
      type: 'slug',
      options: { source: 'title.es', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slugEn',
      title: 'URL en inglés',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      description: `Máximo ${MAX_SHORT_DESCRIPTION_CHARS} caracteres — también se usa como meta description para Google.`,
      type: 'localeText',
      validation: (Rule) =>
        Rule.required().custom((value: { es?: string; en?: string } | undefined) => {
          const esLength = value?.es?.length ?? 0;
          const enLength = value?.en?.length ?? 0;
          if (esLength > MAX_SHORT_DESCRIPTION_CHARS) {
            return `El español tiene ${esLength} caracteres — el máximo es ${MAX_SHORT_DESCRIPTION_CHARS}.`;
          }
          if (enLength > MAX_SHORT_DESCRIPTION_CHARS) {
            return `El inglés tiene ${enLength} caracteres — el máximo es ${MAX_SHORT_DESCRIPTION_CHARS}.`;
          }
          return true;
        }),
    }),
    defineField({
      name: 'longDescription',
      title: 'Descripción completa',
      type: 'localeBlock',
    }),
    defineField({
      name: 'heroImage',
      title: 'Foto principal',
      description: `Mínimo ${MIN_HERO_LONG_EDGE_PX}px de lado largo — es la foto que domina la pantalla en el detalle del tour.`,
      type: 'richImage',
      validation: (Rule) => Rule.required().custom(createMinimumImageSizeValidator(MIN_HERO_LONG_EDGE_PX)),
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      description: `Mínimo ${MIN_GALLERY_IMAGES} fotos para poder publicar, se recomiendan ${RECOMMENDED_GALLERY_IMAGES} o más. Cada una, mínimo ${MIN_GALLERY_LONG_EDGE_PX}px de lado largo.`,
      type: 'array',
      of: [defineArrayMember({ type: 'richImage' })],
      validation: (Rule) => [
        Rule.required()
          .min(MIN_GALLERY_IMAGES)
          .error(`Sube al menos ${MIN_GALLERY_IMAGES} fotos para poder publicar este tour.`),
        Rule.custom(async (images: { asset?: { _ref?: string } }[] | undefined, context) => {
          if (!Array.isArray(images) || images.length === 0) return true;
          const validateOne = createMinimumImageSizeValidator(MIN_GALLERY_LONG_EDGE_PX);
          const results = await Promise.all(images.map((image) => validateOne(image, context)));
          return results.find((result) => result !== true) ?? true;
        }),
        Rule.custom((images: unknown[] | undefined) =>
          Array.isArray(images) && images.length > 0 && images.length < RECOMMENDED_GALLERY_IMAGES
            ? `Se recomiendan ${RECOMMENDED_GALLERY_IMAGES} o más fotos — hay ${images.length}.`
            : true,
        ).warning(),
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [defineArrayMember({ type: 'videoEmbed' })],
    }),
    defineField({
      name: 'priceAmount',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'priceCurrency',
      title: 'Moneda',
      type: 'string',
      options: {
        list: [
          { title: 'MXN', value: 'MXN' },
          { title: 'USD', value: 'USD' },
        ],
      },
      initialValue: 'MXN',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceUnit',
      title: 'Unidad de precio',
      description: 'Ej: "por persona"',
      type: 'localeString',
    }),
    defineField({
      name: 'priceNote',
      title: 'Nota de precio',
      description: 'Ej: "aplican términos y restricciones"',
      type: 'localeString',
    }),
    defineField({
      name: 'durationHours',
      title: 'Duración (horas)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'departureTimes',
      title: 'Horarios de salida',
      description: 'Ej: "9:00 AM y 2:00 PM"',
      type: 'string',
    }),
    defineField({
      name: 'meetingPoint',
      title: 'Punto de encuentro',
      type: 'localeString',
    }),
    defineField({
      name: 'meetingPointMapUrl',
      title: 'Liga a Google Maps',
      type: 'url',
    }),
    defineField({
      name: 'includes',
      title: 'Qué incluye',
      type: 'array',
      of: [defineArrayMember({ type: 'localeString' })],
    }),
    defineField({
      name: 'excludes',
      title: 'Qué no incluye',
      type: 'array',
      of: [defineArrayMember({ type: 'localeString' })],
    }),
    defineField({
      name: 'whatToBring',
      title: 'Qué llevar',
      type: 'array',
      of: [defineArrayMember({ type: 'localeString' })],
    }),
    defineField({
      name: 'minAge',
      title: 'Edad mínima',
      type: 'number',
    }),
    defineField({
      name: 'suitability',
      title: 'Para quién es',
      type: 'localeString',
    }),
    defineField({
      name: 'tags',
      title: 'Categorías',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'tag' }] })],
    }),
    defineField({
      name: 'operator',
      title: 'Operador aliado',
      description: 'Solo si este tour lo opera un tercero — ver HANDOFF §1, modelo de broker.',
      type: 'reference',
      to: [{ type: 'partner' }],
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Mensaje de WhatsApp',
      description: 'El mensaje prellenado al tocar el botón de WhatsApp. Ej: "Hola, quiero reservar el tour a Yelapa"',
      type: 'localeString',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      description: 'Elegible para el carrusel de tours destacados del home.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Orden',
      type: 'number',
    }),
    defineField({
      name: 'visible',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO (opcional)',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Título para buscadores', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Descripción para buscadores', type: 'text' }),
        defineField({ name: 'ogImage', title: 'Imagen para compartir en redes', type: 'image' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title.es', media: 'heroImage', visible: 'visible' },
    prepare({ title, media, visible }) {
      return {
        title: title || 'Sin título',
        subtitle: visible ? 'Mostrando en el sitio' : 'Oculto',
        media,
      };
    },
  },
});
