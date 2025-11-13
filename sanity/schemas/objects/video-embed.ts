import { defineField, defineType } from 'sanity';

/**
 * Un video de YouTube embebido. La orientación es obligatoria a propósito:
 * un video vertical dentro de un reproductor 16:9 deja barras negras y se
 * ve barato — el frontend necesita saber de antemano cómo reservar el
 * espacio (HANDOFF §4, "Por qué embeds de YouTube y no video nativo").
 */
const YOUTUBE_URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/i;

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video de YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'Liga de YouTube',
      type: 'url',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          typeof value === 'string' && YOUTUBE_URL_PATTERN.test(value)
            ? true
            : 'Esa liga no parece ser un video de YouTube. Copia la liga tal como aparece en la barra del navegador.',
        ),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'localeString',
    }),
    defineField({
      name: 'orientation',
      title: 'Orientación',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Horizontal (grabado acostado)', value: 'horizontal' },
          { title: 'Vertical (grabado parado, como reel)', value: 'vertical' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customThumbnail',
      title: 'Miniatura personalizada (opcional)',
      type: 'image',
    }),
  ],
});
