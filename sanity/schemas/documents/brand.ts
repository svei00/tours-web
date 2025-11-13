import { defineField, defineType } from 'sanity';

/**
 * Singleton, panel de Svei — no anunciado al cliente (HANDOFF §5). En este
 * tier gratuito "oculto" significa "no le decimos al cliente que existe",
 * no control de permisos real; el modelo de amenaza es que el cliente
 * ponga el sitio feo, no un atacante.
 *
 * NOTA — tensión sin resolver con HANDOFF §7: la Fase A construyó
 * src/config/brand.ts como la ÚNICA fuente de verdad de marca, con
 * validación de contraste AA que corre en build time (ver derive-palette.ts
 * y el comentario en brand.ts). Este documento de Sanity tiene los mismos
 * campos, pero AÚN NO alimenta esa validación ni el sitio publicado —
 * hoy son dos mecanismos paralelos. Falta decidir con Svei si: (a) este
 * documento se queda solo como referencia/plantilla para clientes futuros
 * y Sandoval Tours sigue usando el brand.ts de código, o (b) brand.ts pasa
 * a leer estos valores de Sanity en build time (y entonces la validación
 * de contraste tendría que correr contra estos valores, no contra el
 * archivo). Mientras no se decida, cambiar los colores aquí NO cambia
 * nada en el sitio publicado.
 */
export const brand = defineType({
  name: 'brand',
  title: 'Marca (uso interno)',
  type: 'document',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Nombre del negocio',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'logoDark', title: 'Logo para fondo oscuro', type: 'image' }),
    defineField({
      name: 'primaryColor',
      title: 'Color primario',
      description: 'Hexadecimal, ej: #0C5D63.',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .error('Escribe un hexadecimal válido, ej: #0C5D63'),
    }),
    defineField({
      name: 'accentColor',
      title: 'Color de acento',
      description: 'Hexadecimal, ej: #E4572E.',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .error('Escribe un hexadecimal válido, ej: #E4572E'),
    }),
    defineField({
      name: 'headlineFont',
      title: 'Tipografía de titulares',
      type: 'string',
      options: { list: ['Fraunces', 'Source Sans 3'] },
    }),
    defineField({
      name: 'bodyFont',
      title: 'Tipografía de cuerpo',
      type: 'string',
      options: { list: ['Figtree', 'Source Sans 3'] },
    }),
    defineField({
      name: 'radiusScale',
      title: 'Escala de radios',
      description: 'Uso interno — normalmente no hace falta tocarlo.',
      type: 'string',
    }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
  ],
  preview: {
    select: { title: 'businessName' },
  },
});
