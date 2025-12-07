// Fixes the duplicate _key bug from import-mock-tours.mjs (all gallery items
// got the same _key because it was derived from only the first 6 bytes of
// the filename) and publishes the 3 tours whose photos clear the schema's
// resolution minimums. Undersized gallery photos are dropped by parsing the
// width/height Sanity encodes into the asset _ref, not by filename.
//
// Run with: node --env-file=.env.local scripts/publish-ready-tours.mjs
import crypto from 'node:crypto';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-08-15',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const MIN_GALLERY_LONG_EDGE_PX = 1600;
const ALL_DRAFT_KEYS = [
  'animas-arcos-colomitos-madagascar',
  'barco-pirata',
  'cascadas-eden',
  'neon-party',
  'yelapa-majahuitas',
];
const PUBLISH_KEYS = new Set(['animas-arcos-colomitos-madagascar', 'yelapa-majahuitas', 'neon-party']);

function longEdgeOf(assetRef) {
  const match = assetRef.match(/-(\d+)x(\d+)-/);
  if (!match) throw new Error(`Can't parse dimensions from ref: ${assetRef}`);
  return Math.max(Number(match[1]), Number(match[2]));
}

function reKeyed(image) {
  return { ...image, _key: `img-${crypto.randomBytes(6).toString('hex')}` };
}

async function processTour(key) {
  const draftId = `drafts.tour-${key}`;
  const draft = await client.getDocument(draftId);
  if (!draft) throw new Error(`${key}: draft not found (${draftId})`);

  const willPublish = PUBLISH_KEYS.has(key);
  const originalCount = draft.gallery.length;

  let gallery = draft.gallery.map(reKeyed);
  if (willPublish) {
    gallery = gallery.filter((img) => longEdgeOf(img.asset._ref) >= MIN_GALLERY_LONG_EDGE_PX);
    if (gallery.length < 4) {
      throw new Error(`${key}: only ${gallery.length} gallery images clear ${MIN_GALLERY_LONG_EDGE_PX}px, schema needs >= 4`);
    }
  }

  if (!willPublish) {
    await client.patch(draftId).set({ gallery }).commit();
    console.log(`[${key}] re-keyed gallery in place (still draft, unpublishable: low-res photos)`);
    return;
  }

  const { _id, _rev, ...rest } = draft;
  const publishedId = `tour-${key}`;
  const published = { ...rest, _id: publishedId, gallery, hidden: false };

  await client.createOrReplace(published);
  await client.delete(draftId);
  console.log(`[${key}] published as ${publishedId} (gallery: ${originalCount} -> ${gallery.length}, re-keyed)`);
}

async function main() {
  for (const key of ALL_DRAFT_KEYS) {
    await processTour(key);
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
