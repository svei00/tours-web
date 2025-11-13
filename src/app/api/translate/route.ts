import { NextResponse } from 'next/server';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

/**
 * Proxy serverless hacia DeepL para el botón de traducir del Studio.
 * Existe por una sola razón: la llave de API no puede vivir en el
 * navegador (HANDOFF.md §5). Este archivo corre en el servidor de Vercel,
 * así que es el único lugar que conoce DEEPL_API_KEY.
 */
export async function POST(request: Request) {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPL_API_KEY no está configurada en el servidor. Avisa a Svei.' },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const text = body?.text;

  if (typeof text !== 'string' || text.trim() === '') {
    return NextResponse.json({ error: 'Falta el texto a traducir.' }, { status: 400 });
  }

  const deeplResponse = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: [text], source_lang: 'ES', target_lang: 'EN-US' }),
  });

  if (!deeplResponse.ok) {
    return NextResponse.json({ error: 'DeepL rechazó la solicitud de traducción.' }, { status: 502 });
  }

  const deeplBody = (await deeplResponse.json()) as { translations?: { text?: string }[] };
  const translatedText = deeplBody.translations?.[0]?.text;

  if (!translatedText) {
    return NextResponse.json({ error: 'DeepL no devolvió ninguna traducción.' }, { status: 502 });
  }

  return NextResponse.json({ translatedText });
}
