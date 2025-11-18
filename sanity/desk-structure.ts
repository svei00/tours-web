import type { StructureResolver } from 'sanity/structure';

/**
 * Cuatro secciones para el cliente no técnico: Tours, Reseñas, Promociones,
 * Configuración (HANDOFF §5, "UX del Studio"). Categorías y Operadores
 * aliados no tienen sección propia a propósito — se crean y editan desde
 * adentro del formulario de un tour, la primera vez que se le agrega una
 * categoría o un operador, para no sumar una quinta y sexta sección que el
 * cliente tendría que aprender a usar por separado.
 *
 * `brand` va al fondo, sin badge ni ícono llamativo — "oculto" en el
 * sentido de HANDOFF §5: no se anuncia, no que esté bloqueado.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pura Vida Travel')
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
        .title('Configuración')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Marca (uso interno)')
        .child(S.document().schemaType('brand').documentId('brand')),
    ]);
