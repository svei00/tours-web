import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { structure } from './desk-structure';
import { schemaTypes } from './schemas';

/**
 * projectId/dataset vacíos son válidos en build time (el Studio simplemente
 * no va a poder conectar hasta que existan de verdad) — ver NOTES.md,
 * sección de la Fase B, para los pasos que Svei tiene que correr una vez
 * para crear el proyecto de Sanity y llenar estas variables.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'default',
  title: 'Sandoval Tours',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
