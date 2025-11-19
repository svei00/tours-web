import { Container } from '@/components/ui/container';
import { NautilusMark } from '@/components/ui/nautilus-mark';
import type { Locale } from '@/lib/sanity/types';

import styles from './curation-section.module.css';

/**
 * La historia del broker (HANDOFF §1 y §6): "no somos dueños de la flota,
 * sabemos cuáles valen la pena" -- curaduría y conocimiento local, no
 * lujo. Bloque editorial a sangre en trench con texto blanco (HANDOFF §7,
 * "Tema oscuro: descartado... lo que sí se hace es usar secciones oscuras
 * de forma editorial").
 *
 * Copy fija, no viene de siteSettings: es la narrativa de marca del brief
 * (HANDOFF §1), no un campo que el cliente vaya a estar cambiando semana a
 * semana -- mismo trato que los textos de nav o los mensajes de WhatsApp,
 * que también viven como diccionarios bilingües en el componente.
 */
const COPY: Record<Locale, { title: string; body: string }> = {
  es: {
    title: 'No somos dueños de las lanchas. Sabemos cuáles valen la pena.',
    body: 'Somos curadores, no operadores. Conocemos Bahía de Banderas de memoria — qué tour cumple lo que promete, qué operador de verdad cuida a su gente. Elegimos por ti para que no tengas que adivinar.',
  },
  en: {
    title: "We don't own the boats. We know which ones are worth it.",
    body: "We're curators, not operators. We know Banderas Bay by heart — which tour actually delivers, which operator really takes care of people. We choose for you so you don't have to guess.",
  },
};

export function CurationSection({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

  return (
    <section className={styles.section}>
      {/* Marca de agua decorativa: rompe el bloque plano de trench sin depender de que haya fotos cargadas. */}
      <NautilusMark size={480} className={styles.watermark} />
      <Container>
        <div className={styles.inner}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.body}>{copy.body}</p>
        </div>
      </Container>
    </section>
  );
}
