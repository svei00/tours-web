import { defineField, defineType } from 'sanity';

export const tag = defineType({
  name: 'tag',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'name.es', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      description: 'Para la página de esta categoría (/tours/categoria/...).',
      type: 'localeString',
    }),
    defineField({
      name: 'visible',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name.es' },
  },
});
