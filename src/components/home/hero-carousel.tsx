'use client';

import { useEffect, useRef, useState } from 'react';

import { RichImage } from '@/components/ui/rich-image';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { localeValue, type Locale, type LocaleString, type RichImageValue } from '@/lib/sanity/types';

import styles from './hero-carousel.module.css';

const AUTOPLAY_MS = 6000;
const TOUCH_RESUME_DELAY_MS = 6000;

const CTA_LABEL: Record<Locale, string> = {
  es: 'Reservar por WhatsApp',
  en: 'Book on WhatsApp',
};

const DOT_LABEL: Record<Locale, string> = {
  es: 'Ir a la diapositiva',
  en: 'Go to slide',
};

/**
 * Copy de respaldo mientras el cliente no ha llenado heroHeadline /
 * heroSubheadline en el Studio (HANDOFF §1: la historia es curaduría, no
 * dueños de flota) — igual que WhatsAppButton o EmptyState, esto nunca
 * debe verse roto solo porque el CMS está vacío todavía.
 */
const FALLBACK_HEADLINE: LocaleString = {
  es: 'Puerto Vallarta, sin adivinar cuál tour vale la pena.',
  en: 'Puerto Vallarta, without guessing which tour is worth it.',
};

const FALLBACK_SUBHEADLINE: LocaleString = {
  es: 'Curamos los mejores tours y experiencias de Bahía de Banderas — tú solo escoge.',
  en: 'We curate the best tours and experiences in Banderas Bay — you just pick.',
};

type HeroCarouselProps = {
  slides: RichImageValue[];
  headline: LocaleString | null;
  subheadline: LocaleString | null;
  whatsappPhone: string | null | undefined;
  whatsappSecondaryPhone?: string | null | undefined;
  whatsappPrimaryName?: string | null | undefined;
  whatsappSecondaryName?: string | null | undefined;
  /** `siteSettings.heroScrimEnabled` -- null/undefined (campo sin llenar todavía) cuenta como encendido, mismo trato que el resto de los booleanos del Studio. */
  scrimEnabled?: boolean | null;
  locale: Locale;
};

/**
 * HANDOFF §6, "Decisión del carrusel del hero": autoplay de 6s con el
 * titular y el CTA quietos — solo las fotos rotan. Un carrusel hero es mal
 * dispositivo de navegación pero bueno de atmósfera, así que lo único que
 * de verdad importa es que el mensaje y el botón de WhatsApp nunca se
 * sustituyan debajo del cursor de alguien.
 */
export function HeroCarousel({
  slides,
  headline,
  subheadline,
  whatsappPhone,
  whatsappSecondaryPhone,
  whatsappPrimaryName,
  whatsappSecondaryName,
  scrimEnabled,
  locale,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  /**
   * Lazy initializer en vez de un efecto que llama setState: el valor
   * inicial se calcula durante el render (React lo recomienda sobre
   * "sincronizar" un valor externo con un efecto que solo corre una vez).
   * El efecto de abajo sí usa el patrón correcto de useEffect: se
   * suscribe al evento `change` de matchMedia para reaccionar si la
   * preferencia del sistema cambia en caliente.
   */
  const [autoplayEnabled, setAutoplayEnabled] = useState(() => {
    if (typeof window === 'undefined') return slides.length > 1;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && slides.length > 1;
  });
  const touchResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const headlineText = localeValue(headline ?? FALLBACK_HEADLINE, locale) || localeValue(FALLBACK_HEADLINE, locale);
  const subheadlineText = localeValue(subheadline ?? FALLBACK_SUBHEADLINE, locale) || localeValue(FALLBACK_SUBHEADLINE, locale);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setAutoplayEnabled(!query.matches && slides.length > 1);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [slides.length]);

  useEffect(() => {
    if (!autoplayEnabled || isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplayEnabled, isPaused, slides.length]);

  useEffect(() => {
    return () => {
      if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current);
    };
  }, []);

  const handleTouchStart = () => {
    if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current);
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    touchResumeTimer.current = setTimeout(() => setIsPaused(false), TOUCH_RESUME_DELAY_MS);
  };

  const whatsappMessage = locale === 'es' ? 'Hola, quiero información sobre los tours' : 'Hi, I want information about the tours';

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.length > 0 ? (
        <div className={styles.slides}>
          {slides.map((slide, index) => (
            <div key={index} className={index === activeIndex ? `${styles.slide} ${styles.slideActive}` : styles.slide}>
              <RichImage image={slide} locale={locale} sizes="100vw" priority={index === 0} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.fallbackBg} />
      )}

      {scrimEnabled !== false && <div className={styles.scrim} aria-hidden="true" />}

      <div className={styles.content}>
        <h1 className={styles.headline}>{headlineText}</h1>
        {subheadlineText && <p className={styles.subheadline}>{subheadlineText}</p>}
        {/*
          `.ctaWrap` (no `.wrap` de WhatsAppButton, que es compartido con el
          header/las barras fijas) es lo que evita que el selector de dos
          números se estire al ancho de esta columna -- ver el comentario
          en hero-carousel.module.css.
        */}
        <div className={styles.ctaWrap}>
          <WhatsAppButton
            phone={whatsappPhone}
            secondaryPhone={whatsappSecondaryPhone}
            primaryName={whatsappPrimaryName}
            secondaryName={whatsappSecondaryName}
            message={whatsappMessage}
            className={styles.cta}
            menuDirection="up"
          >
            {CTA_LABEL[locale]}
          </WhatsAppButton>
        </div>
      </div>

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
              aria-current={index === activeIndex}
              aria-label={`${DOT_LABEL[locale]} ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
