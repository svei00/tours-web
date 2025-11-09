import { brand, semanticColors } from '@/config/brand';
import { COLOR_STEPS } from '@/lib/colors/derive-palette';

import styles from './page.module.css';

/**
 * Página de verificación de la Fase A (HANDOFF §14). No es el home real
 * — eso llega en la Fase E. Su único trabajo es dejar ver a simple vista
 * que cambiar primaryColor/accentColor en src/config/brand.ts retematiza
 * todo lo que hay aquí abajo, sin tocar ningún componente.
 */
export default function TokenShowcasePage() {
  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <h1 className="font-headline">{brand.businessName}</h1>
        <p>
          Página de verificación de tokens — Fase A. Cambia <code>primaryColor</code> o{' '}
          <code>accentColor</code> en <code>src/config/brand.ts</code> y todo lo de abajo
          debe cambiar de color al recargar.
        </p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Escala primaria</h2>
        <div className={styles.swatchRow}>
          {COLOR_STEPS.map((step) => (
            <div
              key={step}
              className={styles.swatch}
              style={{
                backgroundColor: `var(--color-primary-${step})`,
                color: step >= 500 ? semanticColors.white : semanticColors.ink,
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Escala de acento</h2>
        <div className={styles.swatchRow}>
          {COLOR_STEPS.map((step) => (
            <div
              key={step}
              className={styles.swatch}
              style={{
                backgroundColor: `var(--color-accent-${step})`,
                color: step >= 500 ? semanticColors.white : semanticColors.ink,
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Botones</h2>
        <div className={styles.buttonRow}>
          <button className={styles.buttonPrimary}>Botón primario</button>
          <button className={styles.buttonAccent}>Botón de acento</button>
          <button className={styles.buttonWhatsapp}>Reservar por WhatsApp</button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Trench (footer / nav / overlays)</h2>
        <div className={styles.trenchCard}>Fondo oscuro derivado del primario, texto blanco encima.</div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tipografía</h2>
        <div className={styles.typeSample}>
          <span className="font-headline" style={{ fontSize: 'var(--font-size-display)' }}>
            {brand.headlineFont}
          </span>
          <span style={{ fontSize: 'var(--font-size-bodyLg)' }}>{brand.bodyFont} — cuerpo de texto de muestra.</span>
        </div>
      </section>
    </main>
  );
}
