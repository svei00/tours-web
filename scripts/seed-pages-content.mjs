// One-off migration: moves the legal-page copy that used to be hardcoded in
// src/components/misc/privacy-page.tsx and terms-page.tsx into the new
// `legalPrivacy`/`legalTerms` Sanity singletons, and seeds starter copy for
// the new `aboutPage`/`contactPage` singletons (client asked for these to
// move to the CMS so they're editable without a code change).
//
// Legal content is migrated verbatim -- it was already reviewed/confirmed
// with the client per the comments in the original components -- EXCEPT the
// ARCO response-days count, which stays a literal bracketed placeholder
// ("[20] días hábiles") because it was never actually confirmed. `updatedAt`
// is intentionally left unset on both legal docs: that field is what keeps
// /privacidad and /terminos out of search results and showing the draft
// notice (see sanity/schemas/documents/legal-privacy.ts) -- Svei or the
// client fill it in from the Studio once they've reviewed the bracketed
// placeholder and are ready to go live, no code change needed.
//
// Run with: node --env-file=.env.local scripts/seed-pages-content.mjs
import crypto from 'node:crypto';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-08-15',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function key() {
  return crypto.randomBytes(6).toString('hex');
}

function span(text) {
  return { _type: 'span', _key: key(), text, marks: [] };
}

function paragraph(text) {
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [span(text)] };
}

function bulletList(items) {
  return items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [span(text)],
  }));
}

function localeString(es, en) {
  return { es, en, enIsMachineDraft: false };
}

function localeBlock(esBlocks, enBlocks) {
  return { es: esBlocks, en: enBlocks, enIsMachineDraft: false };
}

function section(headingEs, headingEn, esBlocks, enBlocks) {
  return { _key: key(), heading: localeString(headingEs, headingEn), body: localeBlock(esBlocks, enBlocks) };
}

const PRIVACY_SECTIONS = [
  section(
    'Responsable',
    'Who is responsible for your data',
    [
      paragraph(
        'José Sandoval Villarreal, operando comercialmente como Pura Vida Vallarta Tours, con domicilio en Valle de Bravo 101, esquina con avenida Valle de México, es responsable del tratamiento de sus datos personales.',
      ),
    ],
    [
      paragraph(
        'José Sandoval Villarreal, doing business as Pura Vida Vallarta Tours, with address at Valle de Bravo 101, esquina con avenida Valle de México, is responsible for the processing of your personal data.',
      ),
    ],
  ),
  section(
    'Datos que recabamos',
    'Data we collect',
    [
      paragraph(
        'Cuando usted nos contacta por WhatsApp, teléfono o correo, podemos recabar: nombre, número telefónico, correo electrónico, y los datos de la reserva (fecha, número de personas, tour de interés). Adicionalmente, nuestro sitio web recaba datos de navegación mediante herramientas de analítica (páginas visitadas, tiempo de permanencia, origen del tráfico).',
      ),
    ],
    [
      paragraph(
        'When you contact us by WhatsApp, phone, or email, we may collect: your name, phone number, email address, and booking details (date, number of people, tour of interest). Our website also collects browsing data through analytics tools (pages visited, time on site, traffic source).',
      ),
    ],
  ),
  section(
    'Finalidades',
    'Purposes',
    [
      paragraph('Primarias (necesarias):'),
      ...bulletList(['Atender su solicitud de información', 'Gestionar y confirmar su reserva', 'Coordinar con el operador que presta el servicio']),
      paragraph('Secundarias (puede oponerse):'),
      ...bulletList(['Enviarle promociones y ofertas']),
    ],
    [
      paragraph('Primary (necessary to serve you):'),
      ...bulletList(['Responding to your request for information', 'Managing and confirming your booking', 'Coordinating with the operator that runs the tour']),
      paragraph('Secondary (you may opt out):'),
      ...bulletList(['Sending you promotions and offers']),
    ],
  ),
  section(
    'Transferencias',
    'Data sharing',
    [
      paragraph(
        'Para prestar el servicio contratado transferimos sus datos de reserva a los operadores turísticos que ejecutan cada tour. Esta transferencia es necesaria para la prestación del servicio.',
      ),
    ],
    [
      paragraph(
        'To provide the service you booked, we share your booking data with the tour operators who actually run each experience. This sharing is necessary to deliver the service.',
      ),
    ],
  ),
  section(
    'Derechos ARCO',
    'Your rights (access, rectification, cancellation, objection)',
    [
      paragraph(
        'Usted puede solicitar el Acceso, Rectificación, Cancelación u Oposición al tratamiento de sus datos escribiéndonos por WhatsApp o al correo de contacto que aparece en este sitio. Responderemos en un plazo máximo de [20] días hábiles.',
      ),
    ],
    [
      paragraph(
        'You may request access to, correction of, deletion of, or objection to the processing of your personal data by messaging us on WhatsApp or at the contact email listed on this site. We will respond within a maximum of [20] business days.',
      ),
    ],
  ),
  section(
    'Cookies y rastreo',
    'Cookies and tracking',
    [
      paragraph(
        'Este sitio utiliza cookies de Google Analytics para medir el tráfico. Puede deshabilitarlas desde la configuración de su navegador. Contactarnos por WhatsApp inicia una conversación en una plataforma de terceros sujeta a sus propias políticas.',
      ),
    ],
    [
      paragraph(
        'This site uses Google Analytics cookies to measure traffic. You can disable them from your browser settings. Contacting us on WhatsApp starts a conversation on a third-party platform subject to its own policies.',
      ),
    ],
  ),
  section(
    'Cambios al aviso',
    'Changes to this notice',
    [paragraph('Cualquier cambio a este aviso se publicará en esta misma página.')],
    [paragraph('Any change to this notice will be published on this same page.')],
  ),
];

const TERMS_SECTIONS = [
  section(
    'Somos intermediarios, no el operador',
    'We are an intermediary, not the operator',
    [
      paragraph(
        'Pura Vida Vallarta Tours funciona como bróker: no somos dueños de las lanchas, vans ni instalaciones usadas en los tours. Cada experiencia es operada por un tercero independiente. Pura Vida Vallarta Tours cura, coordina y facilita la reserva, pero el servicio en sí lo presta ese operador, quien es responsable de su ejecución correcta y segura.',
      ),
    ],
    [
      paragraph(
        'Pura Vida Vallarta Tours acts as a broker: we do not own the boats, vans, or facilities used on our tours. Each experience is operated by an independent third-party operator. Pura Vida Vallarta Tours curates, coordinates, and facilitates the booking, but the actual service is delivered by that operator, who is responsible for its safe and proper execution.',
      ),
    ],
  ),
  section(
    'Reservas y confirmación',
    'Booking and confirmation',
    [
      paragraph(
        'Las reservas se hacen y se confirman por WhatsApp. Una reserva solo queda confirmada cuando usted recibe un mensaje de confirmación explícito de nuestra parte — enviar un mensaje por sí solo no garantiza un lugar apartado.',
      ),
    ],
    [
      paragraph(
        'Bookings are made and confirmed through WhatsApp. A booking is only confirmed once you receive an explicit confirmation message from us — sending a message alone does not guarantee a reserved spot.',
      ),
    ],
  ),
  section(
    'Formas de pago y anticipos',
    'Payment and deposits',
    [
      paragraph(
        'Para apartar una reserva se deja un depósito. El monto varía según el tour — se lo confirmamos por WhatsApp al momento de reservar. El depósito se puede pagar por transferencia bancaria o en efectivo.',
      ),
    ],
    [
      paragraph(
        "Holding a booking requires a deposit. The amount varies by tour — we'll confirm the exact amount on WhatsApp when you book. The deposit can be paid by bank transfer or in cash.",
      ),
    ],
  ),
  section(
    'Política de cancelación',
    'Cancellation policy',
    [
      paragraph(
        'Si cancela con al menos 24 horas de anticipación a la fecha del tour, se reembolsa el 50% del depósito. Si cancela el mismo día del tour, no aplica reembolso. Esto se debe a que, al cancelar, los operadores turísticos nos aplican una sanción por los cupos ya apartados que no se pueden revender a tiempo.',
      ),
    ],
    [
      paragraph(
        'If you cancel at least 24 hours before the tour, we refund 50% of your deposit. If you cancel the same day as the tour, no refund applies. This is because tour operators penalize us for cancelled spots that were already held and can no longer be resold in time.',
      ),
    ],
  ),
  section(
    'Cancelaciones por clima',
    'Weather cancellations',
    [
      paragraph(
        'Los tours en lancha y actividades acuáticas pueden ser cancelados o reprogramados por el operador por seguridad, debido a condiciones climáticas. En ese caso le ayudamos a reprogramar o a coordinar un reembolso con el operador, según la política propia de ese operador.',
      ),
    ],
    [
      paragraph(
        "Boat and water-based tours may be cancelled or rescheduled by the operator for safety reasons due to weather conditions. In that case we will help you reschedule or coordinate a refund with the operator, according to that operator's own policy.",
      ),
    ],
  ),
  section(
    'Edad mínima y restricciones de salud',
    'Age and health restrictions',
    [
      paragraph(
        'Algunos tours tienen edad mínima o requisitos específicos de salud/movilidad. Esto se indica en la página de cada tour cuando aplica — revíselo antes de reservar, o pregúntenos por WhatsApp si tiene dudas sobre un tour en particular.',
      ),
    ],
    [
      paragraph(
        "Some tours have a minimum age or specific health/mobility requirements. These are listed on each tour's own page when they apply — please check before booking, or ask us on WhatsApp if you have questions about a specific tour.",
      ),
    ],
  ),
  section(
    'Qué incluye y qué no incluye',
    "What's included and what isn't",
    [
      paragraph(
        'Qué incluye y qué no incluye cada tour se indica en la página de ese tour. Si algo no está listado, asuma que no está incluido y pregúntenos antes de reservar.',
      ),
    ],
    [
      paragraph(
        "What's included and what isn't included is listed on each tour's own page. If something isn't listed, assume it is not included and ask us before booking.",
      ),
    ],
  ),
  section(
    'Limitación de responsabilidad',
    'Limitation of liability',
    [
      paragraph(
        'Como intermediario, Pura Vida Vallarta Tours no es responsable de accidentes, lesiones, pérdida de pertenencias o fallas en el servicio que ocurran durante la ejecución de un tour por parte de su operador. Nuestra responsabilidad se limita a la exactitud de la información que proporcionamos y a facilitar su reserva de buena fe.',
      ),
    ],
    [
      paragraph(
        'As an intermediary, Pura Vida Vallarta Tours is not liable for accidents, injuries, loss of belongings, or service failures that occur during the execution of a tour by its operator. Our responsibility is limited to the accuracy of the information we provide and to facilitating your booking in good faith.',
      ),
    ],
  ),
  section(
    'Precios',
    'Prices',
    [paragraph('Los precios mostrados en este sitio pueden cambiar sin previo aviso. Aplica el precio confirmado al momento de reservar.')],
    [paragraph('Prices shown on this site may change without prior notice. The price confirmed at the time of booking applies.')],
  ),
];

const ABOUT_LEAD = localeString(
  'No somos dueños de las lanchas. Somos quienes saben cuáles vale la pena abordar.',
  "We don't own the boats. We're the ones who know which ones are worth boarding.",
);

const ABOUT_BODY = localeBlock(
  [
    paragraph(
      'Pura Vida Vallarta Tours nació en Puerto Vallarta con una idea simple: en una bahía llena de operadores, alguien tiene que conocerlos a todos y decir la verdad sobre cuáles valen la pena. Eso es lo que hacemos — no operamos las lanchas ni los tours nosotros mismos, los seleccionamos.',
    ),
    paragraph(
      'Cada experiencia en este sitio pasó primero por nosotros: la probamos, hablamos con el operador, y solo la ofrecemos si de verdad se la recomendaríamos a un amigo. Esa curación es el trabajo — no vender el tour más caro, sino el que le conviene a cada quien.',
    ),
  ],
  [
    paragraph(
      "Pura Vida Vallarta Tours started in Puerto Vallarta with a simple idea: in a bay full of operators, someone has to know them all and tell the truth about which ones are actually worth it. That's what we do — we don't run the boats or the tours ourselves, we select them.",
    ),
    paragraph(
      "Every experience on this site passed through us first: we tried it, talked to the operator, and only offer it if we'd genuinely recommend it to a friend. That curation is the job — not selling the most expensive tour, but the right one for you.",
    ),
  ],
);

const CONTACT_INTRO = localeString(
  '¿Tienes dudas sobre un tour o quieres reservar? Escríbenos por WhatsApp — es la forma más rápida de obtener respuesta. También puedes encontrarnos aquí:',
  "Have questions about a tour or want to book? Message us on WhatsApp — it's the fastest way to get a reply. You can also find us here:",
);

async function main() {
  await client.createOrReplace({ _id: 'legalPrivacy', _type: 'legalPrivacy', sections: PRIVACY_SECTIONS });
  console.log('legalPrivacy seeded (updatedAt left empty -- noindex stays on until reviewed and published from Studio)');

  await client.createOrReplace({ _id: 'legalTerms', _type: 'legalTerms', sections: TERMS_SECTIONS });
  console.log('legalTerms seeded (updatedAt left empty -- noindex stays on until reviewed and published from Studio)');

  await client.createOrReplace({ _id: 'aboutPage', _type: 'aboutPage', lead: ABOUT_LEAD, body: ABOUT_BODY });
  console.log('aboutPage seeded');

  await client.createOrReplace({ _id: 'contactPage', _type: 'contactPage', intro: CONTACT_INTRO });
  console.log('contactPage seeded');

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
