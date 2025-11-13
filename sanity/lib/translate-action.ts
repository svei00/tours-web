/**
 * Puente entre el Studio (que corre en el navegador) y /api/translate (que
 * corre en el servidor). El Studio nunca le pega a DeepL directamente: la
 * llave de API no puede vivir en el navegador (ver HANDOFF.md §5, "El botón
 * de traducir"), así que este archivo solo sabe hablar con nuestra propia
 * ruta serverless.
 */
export async function translateToEnglish(spanishText: string): Promise<string> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: spanishText }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `La traducción falló (estado ${response.status}).`);
  }

  const body = (await response.json()) as { translatedText: string };
  return body.translatedText;
}
