// One-off import: creates DRAFT tour documents from reference/Pictures/*, using
// placeholder pricing/duration/meeting point per Svei's instruction (2026-08-15).
// Content is a starting point, not final copy — every tour needs a manual review
// pass in Studio (real price, duration, descriptions, includes/excludes, video links).
//
// Run with: node --env-file=.env.local scripts/import-mock-tours.mjs
import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PICTURES = path.join(ROOT, 'reference', 'Pictures');

const MOCK_PRICE = 100;
const MOCK_DURATION_HOURS = 1;
const MOCK_MEETING_POINT = { es: 'Puerto Vallarta', en: 'Puerto Vallarta' };

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-08-15',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function localeString(es, en) {
  return { es, en, enIsMachineDraft: true };
}

function checkShortDescLength(tour) {
  for (const lang of ['es', 'en']) {
    const len = tour.shortDescription[lang].length;
    if (len > 160) {
      throw new Error(`${tour.key}: shortDescription.${lang} is ${len} chars, over the 160 limit`);
    }
  }
}

const TOURS = [
  {
    key: 'animas-arcos-colomitos-madagascar',
    folder: 'ANIMAS,ARCOS,COLOMITOS,MAGADASCAR',
    title: localeString(
      'Ánimas, Arcos, Colomitos y Madagascar',
      'Ánimas, Arcos, Colomitos & Madagascar',
    ),
    shortDescription: localeString(
      'Lancha a Las Ánimas, Los Arcos, Colomitos y Madagascar: snorkel, playas escondidas y paradas para nadar en la costa sur de Vallarta.',
      "Boat trip to Las Ánimas, Los Arcos, Colomitos and Madagascar: snorkeling, hidden beaches and swim stops on Vallarta's south shore.",
    ),
    heroFile: 'TOUR ANIMAS QUIMIXTO ARCOS3.JPG',
    galleryFiles: [
      'TOUR ANIMAS QUIMIXTO ARCOS.JPG',
      'TOUR ANIMAS QUIMIXTO ARCOS2.JPG',
      'TOUR ANIMAS-COL-MAGA-ARCOS1.jpg',
      'TOUR ANIMAS-COL-MAGA-ARCOS3.jpg',
      'TOUR ANIMAS-COL-MAGA-ARCOS4.jpg',
      'TOUR ANIMAS-COL-MAGA-ARCOS5.jpg',
      'TOUR ANIMAS-COL-MAGA-ARCOS6.jpg',
      'TOUR ANIMAS-COL-MAGA-ARCOS7.jpg',
      'TOUR ANIMAS-COL-MAGA.ARCOS2.jpg',
    ],
  },
  {
    key: 'barco-pirata',
    folder: 'BARCO PIRATA',
    title: localeString('Barco Pirata', 'Pirate Ship'),
    shortDescription: localeString(
      'Crucero en barco pirata por la Bahía de Banderas, con salida de día o de noche: música, juegos y vistas al atardecer.',
      'Pirate-ship cruise around Banderas Bay, day or night departures: music, games and sunset views.',
    ),
    heroFile: 'BARCO PIRATA DÍA.jpeg',
    galleryFiles: [
      'BARCO PIRATA DÍA (2).jpeg',
      'BARCO PIRATA DÍA 3.jpeg',
      'BARCO PIRATA DÍA 4.jpeg',
      'BARCO PIRATA NOCHE.jpeg',
      'BARCO PIRATA NOCHE (2).jpeg',
      'BARCO PIRATA NOCHE 3.jpeg',
      'BARCO PIRATA NOCHE 4.jpeg',
    ],
  },
  {
    key: 'cascadas-eden',
    folder: 'CASCADAS EDÉN',
    title: localeString('Cascadas Edén', 'Edén Waterfalls'),
    shortDescription: localeString(
      'Excursión a las Cascadas del Edén en la sierra de Vallarta: tirolesas, chapuzón en poza natural y selva.',
      'Trip to the Edén Waterfalls in the Vallarta mountains: zip-lines, a dip in the natural pool and jungle.',
    ),
    heroFile: 'TOUR CASCADAS EDEN 6.jpeg',
    galleryFiles: [
      'TOUR CASCADAS EDÉN 1.jpeg',
      'TOUR CASCADAS EDÉN 2.jpeg',
      'TOUR CASCADAS EDÉN 3.jpeg',
      'TOUR CASCADAS EDÉN 4.jpeg',
      'TOUR CASCADAS EDÉN 5.jpeg',
      'TOUR EDEN 7.jpg',
    ],
  },
  {
    key: 'islas-marietas',
    folder: 'ISLAS MARIETAS',
    title: localeString('Islas Marietas', 'Marietas Islands'),
    shortDescription: localeString(
      'Tour en lancha a las Islas Marietas: snorkel, kayak y la famosa Playa del Amor, sujeta a disponibilidad.',
      'Boat tour to the Marietas Islands: snorkeling, kayaking and the famous Playa del Amor, subject to availability.',
    ),
    heroFile: 'TOUR MARIETAS1.jpg',
    galleryFiles: [
      'TOUR MARIETAS2.jpg',
      'TOUR MARIETAS3.jpeg',
      'TOUR MARIETAS4.jpeg',
      'TOUR MARIETAS5.jpeg',
      'TOUR MARIETAS6.jpeg',
      'TOUR MARIETAS7.jpeg',
      'TOUR MARIETAS8.jpeg',
    ],
  },
  {
    key: 'neon-party',
    folder: 'NEON PARTY/NEON PARTY',
    title: localeString('Neon Party', 'Neon Party'),
    shortDescription: localeString(
      'Fiesta en barco al atardecer con luces neón, música en vivo y ambiente de antro en la Bahía de Banderas.',
      'Sunset neon-light boat party with live music and a floating-club vibe on Banderas Bay.',
    ),
    heroFile: 'neon canon22-94.jpg',
    galleryFiles: [
      'IMG_6232.jpg',
      'IMG_6233.jpg',
      'Neon Party BAHIA.jpg',
      'Neon Party BAHIA-3.jpg',
      '_MG_2621.jpg',
      '_MG_2673.jpg',
      '_MG_2715.jpg',
      'IMG_3551.JPG',
      'IMG_4177.JPG',
    ],
  },
  {
    key: 'yelapa-majahuitas',
    folder: 'YELAPA',
    title: localeString('Yelapa y Majahuitas', 'Yelapa & Majahuitas'),
    shortDescription: localeString(
      'Lancha a Yelapa y Majahuitas: playas de acceso solo por mar, cascada y comida junto al mar.',
      'Boat trip to Yelapa and Majahuitas: boat-only beaches, a waterfall and beachfront dining.',
    ),
    heroFile: 'TOUR YELAPA MAJAHUITAS7.jpg',
    galleryFiles: [
      'TOUR YELAPA MAHAJUITAS4.jpg',
      'TOUR YELAPA MAJAHUITAS1.jpg',
      'TOUR YELAPA MAJAHUITAS2.jpg',
      'TOUR YELAPA MAJAHUITAS3.jpg',
      'TOUR YELAPA MAJAHUITAS5.jpg',
      'TOUR YELAPA MAJAHUITAS6.jpg',
      'TOUR YELAPA MAJAHUITAS8.jpg',
      'TOUR YELAPA MAJAHUITAS9.jpg',
    ],
  },
];

async function uploadImage(tour, filename, altSuffix) {
  const filePath = path.join(PICTURES, tour.folder, filename);
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, { filename });
  return {
    _type: 'image',
    _key: `img-${Buffer.from(filename).toString('hex').slice(0, 12)}`,
    asset: { _type: 'reference', _ref: asset._id },
    alt: localeString(`${tour.title.es} — ${altSuffix}`, `${tour.title.en} — ${altSuffix}`),
  };
}

async function importTour(tour) {
  checkShortDescLength(tour);
  console.log(`\n[${tour.key}] uploading hero: ${tour.heroFile}`);
  const heroImage = await uploadImage(tour, tour.heroFile, 'foto principal');

  const gallery = [];
  for (const [i, file] of tour.galleryFiles.entries()) {
    console.log(`[${tour.key}] uploading gallery ${i + 1}/${tour.galleryFiles.length}: ${file}`);
    gallery.push(await uploadImage(tour, file, `foto ${i + 1}`));
  }

  const doc = {
    _id: `drafts.tour-${tour.key}`,
    _type: 'tour',
    title: tour.title,
    slugEs: { _type: 'slug', current: tour.key },
    slugEn: { _type: 'slug', current: tour.key },
    shortDescription: tour.shortDescription,
    heroImage,
    gallery,
    priceAmount: MOCK_PRICE,
    priceCurrency: 'MXN',
    durationHours: MOCK_DURATION_HOURS,
    meetingPoint: MOCK_MEETING_POINT,
    hidden: true,
  };

  await client.createOrReplace(doc);
  console.log(`[${tour.key}] draft created: ${doc._id}`);
}

async function main() {
  for (const tour of TOURS) {
    await importTour(tour);
  }
  console.log('\nDone. All tours created as hidden DRAFTS — review and publish each one in Studio.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
