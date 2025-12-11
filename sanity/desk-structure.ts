import type { StructureResolver } from 'sanity/structure';

/**
 * Cinco secciones para el cliente no técnico: Tours, Reseñas, Promociones,
 * Páginas, Configuración (HANDOFF §5, "UX del Studio", ampliado cuando
 * Nosotros/Contacto/Aviso de privacidad/Términos se movieron de código a
 * Sanity). Categorías y Operadores aliados no tienen sección propia a
 * propósito — se crean y editan desde adentro del formulario de un tour, la
 * primera vez que se le agrega una categoría o un operador, para no sumar
 * más secciones que el cliente tendría que aprender a usar por separado.
 *
 * "Páginas" agrupa los cuatro singletons de contenido de página suelta en
 * una sola entrada, en vez de ponerlos sueltos a la altura de Tours/Reseñas
 * — son edición ocasional, no el trabajo del día a día del cliente.
 *
 * `brand` va al fondo, sin badge ni ícono llamativo — "oculto" en el
 * sentido de HANDOFF §5: no se anuncia, no que esté bloqueado.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pura Vida Vallarta Tours')
    .items([
      S.listItem()
        .title('Tours')
        .child(S.documentTypeList('tour').title('Tours')),
      S.listItem()
        .title('Reseñas')
        .child(S.documentTypeList('review').title('Reseñas')),
      S.listItem()
        .title('Promociones')
        .child(S.documentTypeList('promotion').title('Promociones')),
      S.listItem()
        .title('Páginas')
        .child(
          S.list()
            .title('Páginas')
            .items([
              S.listItem()
                .title('Nosotros')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Contacto')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem()
                .title('Aviso de privacidad')
                .child(S.document().schemaType('legalPrivacy').documentId('legalPrivacy')),
              S.listItem()
                .title('Términos y condiciones')
                .child(S.document().schemaType('legalTerms').documentId('legalTerms')),
            ]),
        ),
      S.listItem()
        .title('Configuración')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Marca (uso interno)')
        .child(S.document().schemaType('brand').documentId('brand')),
    ]);
