/**
 * `JSON.stringify` ya escapa comillas dobles, pero no `</script>` dentro de
 * un string -- si algún día un título trae ese substring literal, cerraría
 * la etiqueta antes de tiempo. El reemplazo es el mismo truco que usa
 * Next.js internamente para su propio JSON embebido.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
