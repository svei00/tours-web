import type { ValidationContext } from 'sanity';

type RichImageValue = { asset?: { _ref?: string } } | undefined;

/**
 * La barandilla de calidad fotográfica (HANDOFF §5, "Validación que
 * BLOQUEA"). Sanity calcula las dimensiones reales de cada archivo al
 * subirlo; este validador solo las consulta y rechaza el guardado si el
 * lado largo mide menos que el mínimo pedido. Hero y galería piden mínimos
 * distintos (2400px vs 1600px), así que el mínimo se pasa como parámetro
 * en vez de quedar fijo en el objeto richImage.
 */
export function createMinimumImageSizeValidator(minLongEdgePx: number) {
  return async (image: RichImageValue, context: ValidationContext): Promise<true | string> => {
    const assetRef = image?.asset?._ref;
    if (!assetRef) return true; // el .required() del campo ya cubre "no hay imagen"

    const client = context.getClient({ apiVersion: '2024-01-01' });
    const dimensions = await client.fetch<{ width: number; height: number } | null>(
      `*[_id == $assetRef][0]{ "width": metadata.dimensions.width, "height": metadata.dimensions.height }`,
      { assetRef },
    );

    if (!dimensions) return true; // el asset todavía se está procesando; no rechazar en falso

    const longEdge = Math.max(dimensions.width, dimensions.height);
    if (longEdge < minLongEdgePx) {
      return (
        `Esta foto mide ${longEdge}px de lado largo. El mínimo es ${minLongEdgePx}px — ` +
        `súbela sin comprimir (ver la guía de fotos para el cliente en HANDOFF.md §15.1).`
      );
    }

    return true;
  };
}
