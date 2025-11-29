import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { LocaleLink } from '@/components/ui/locale-link';
import { getActivePromotions } from '@/lib/sanity/promotions';
import { localeValue, tourSlugFor, type Locale } from '@/lib/sanity/types';

import styles from './promo-banner.module.css';

const COPY: Record<Locale, { defaultBadge: string; cta: string }> = {
  es: { defaultBadge: 'Promoción', cta: 'Ver tour →' },
  en: { defaultBadge: 'Promotion', cta: 'View tour →' },
};

/**
 * Condicional, con auto-expiración (HANDOFF §6): getActivePromotions ya
 * filtra por `endDate >= hoy` en la consulta, así que si no hay ninguna
 * activa esta sección simplemente no se renderiza -- nada que recordarle
 * al cliente apagar. Solo se muestra la promoción más próxima a vencer
 * (la primera del `order(endDate asc)`), para que el home no se sienta
 * saturado de banners si hay varias corriendo a la vez.
 *
 * El CTA lleva directo al tour cuando la promo aplica a uno solo; si
 * aplica a varios o a "todos" (`appliesTo` vacío), lleva al listado
 * completo -- nunca inventa un destino más específico del que hay dato.
 */
export async function PromoBanner({ locale }: { locale: Locale }) {
  const promotions = await getActivePromotions();
  if (promotions.length === 0) return null;

  const promo = promotions[0];
  const copy = COPY[locale];
  const badgeText = promo.badgeText ? localeValue(promo.badgeText, locale) : copy.defaultBadge;
  const description = promo.description ? localeValue(promo.description, locale) : null;

  const ctaHref =
    promo.appliesTo.length === 1 ? `/tours/${tourSlugFor(promo.appliesTo[0], locale)}` : '/tours';

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          {/* variant="muted" a propósito -- la sección ya es fondo coral, un badge "accent" (mismo coral) desaparecería encima. */}
          <Badge variant="muted">{badgeText}</Badge>
          <div className={styles.copy}>
            <p className={styles.title}>{localeValue(promo.title, locale)}</p>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <LocaleLink locale={locale} href={ctaHref} className={styles.cta}>
            {copy.cta}
          </LocaleLink>
        </div>
      </Container>
    </section>
  );
}
