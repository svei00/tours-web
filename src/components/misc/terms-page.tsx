import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { brand } from '@/config/brand';
import { buildAlternates, draftLegalMetadata, LOCALIZED_PATHS } from '@/lib/seo/metadata';
import type { Locale } from '@/lib/sanity/types';

import styles from './legal-page.module.css';

const TITLE: Record<Locale, string> = { es: 'Términos y condiciones', en: 'Terms and conditions' };

/** Igual que privacy-page.tsx: contenido real, `noindex` mientras siga sin fecha de vigencia (la política de anticipo/cancelación ya está confirmada con el cliente). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  return { ...draftLegalMetadata(TITLE[typedLocale]), alternates: buildAlternates(typedLocale, LOCALIZED_PATHS.terms.es, LOCALIZED_PATHS.terms.en) };
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className={styles.placeholder}>[{children}]</span>;
}

const DISCLAIMER: Record<Locale, string> = {
  es: 'Este es un borrador estructural (HANDOFF §11), no asesoría legal. La política de anticipos y cancelación ya está confirmada con el cliente. Solo falta la fecha de vigencia (campo en corcheta color coral) antes de publicar el sitio.',
  en: 'This is a structural draft, not legal advice. The deposit and cancellation policy is already confirmed with the client. Only the effective date (coral bracketed field) is missing before the site goes live.',
};

const UPDATED_LABEL: Record<Locale, string> = { es: 'Última actualización: ', en: 'Last updated: ' };

/** Compartido por /terminos y /terms. */
export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  if (typedLocale === 'en') {
    return (
      <Section>
        <Container>
          <header className={styles.header}>
            <h1 className={styles.title}>{TITLE.en}</h1>
            <p className={styles.updated}>
              {UPDATED_LABEL.en}
              <Placeholder>date</Placeholder>
            </p>
            <p className={styles.disclaimer}>{DISCLAIMER.en}</p>
          </header>
          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. We are an intermediary, not the operator</h2>
              <p>
                {brand.businessName} acts as a broker: we do not own the boats, vans, or facilities used on our tours. Each experience
                is operated by an independent third-party operator. {brand.businessName} curates, coordinates, and facilitates the
                booking, but the actual service is delivered by that operator, who is responsible for its safe and proper execution.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Booking and confirmation</h2>
              <p>
                Bookings are made and confirmed through WhatsApp. A booking is only confirmed once you receive an explicit confirmation
                message from us — sending a message alone does not guarantee a reserved spot.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Payment and deposits</h2>
              <p>
                Holding a booking requires a deposit. The amount varies by tour — we&apos;ll confirm the exact amount on WhatsApp when
                you book. The deposit can be paid by bank transfer or in cash.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Cancellation policy</h2>
              <p>
                If you cancel at least 24 hours before the tour, we refund 50% of your deposit. If you cancel the same day as the
                tour, no refund applies. This is because tour operators penalize us for cancelled spots that were already held and can
                no longer be resold in time.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Weather cancellations</h2>
              <p>
                Boat and water-based tours may be cancelled or rescheduled by the operator for safety reasons due to weather conditions.
                In that case we will help you reschedule or coordinate a refund with the operator, according to that operator&apos;s own
                policy.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Age and health restrictions</h2>
              <p>
                Some tours have a minimum age or specific health/mobility requirements. These are listed on each tour&apos;s own page when
                they apply — please check before booking, or ask us on WhatsApp if you have questions about a specific tour.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>7. What&apos;s included and what isn&apos;t</h2>
              <p>
                What&apos;s included and what isn&apos;t included is listed on each tour&apos;s own page. If something isn&apos;t
                listed, assume it is not included and ask us before booking.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Limitation of liability</h2>
              <p>
                As an intermediary, {brand.businessName} is not liable for accidents, injuries, loss of belongings, or service failures
                that occur during the execution of a tour by its operator. Our responsibility is limited to the accuracy of the
                information we provide and to facilitating your booking in good faith.
              </p>
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Prices</h2>
              <p>Prices shown on this site may change without prior notice. The price confirmed at the time of booking applies.</p>
            </section>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>{TITLE.es}</h1>
          <p className={styles.updated}>
            {UPDATED_LABEL.es}
            <Placeholder>fecha</Placeholder>
          </p>
          <p className={styles.disclaimer}>{DISCLAIMER.es}</p>
        </header>
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Somos intermediarios, no el operador</h2>
            <p>
              {brand.businessName} funciona como bróker: no somos dueños de las lanchas, vans ni instalaciones usadas en los tours. Cada
              experiencia es operada por un tercero independiente. {brand.businessName} cura, coordina y facilita la reserva, pero el
              servicio en sí lo presta ese operador, quien es responsable de su ejecución correcta y segura.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Reservas y confirmación</h2>
            <p>
              Las reservas se hacen y se confirman por WhatsApp. Una reserva solo queda confirmada cuando usted recibe un mensaje de
              confirmación explícito de nuestra parte — enviar un mensaje por sí solo no garantiza un lugar apartado.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Formas de pago y anticipos</h2>
            <p>
              Para apartar una reserva se deja un depósito. El monto varía según el tour — se lo confirmamos por WhatsApp al momento de
              reservar. El depósito se puede pagar por transferencia bancaria o en efectivo.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Política de cancelación</h2>
            <p>
              Si cancela con al menos 24 horas de anticipación a la fecha del tour, se reembolsa el 50% del depósito. Si cancela el
              mismo día del tour, no aplica reembolso. Esto se debe a que, al cancelar, los operadores turísticos nos aplican una
              sanción por los cupos ya apartados que no se pueden revender a tiempo.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Cancelaciones por clima</h2>
            <p>
              Los tours en lancha y actividades acuáticas pueden ser cancelados o reprogramados por el operador por seguridad, debido a
              condiciones climáticas. En ese caso le ayudamos a reprogramar o a coordinar un reembolso con el operador, según la
              política propia de ese operador.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Edad mínima y restricciones de salud</h2>
            <p>
              Algunos tours tienen edad mínima o requisitos específicos de salud/movilidad. Esto se indica en la página de cada tour
              cuando aplica — revíselo antes de reservar, o pregúntenos por WhatsApp si tiene dudas sobre un tour en particular.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Qué incluye y qué no incluye</h2>
            <p>
              Qué incluye y qué no incluye cada tour se indica en la página de ese tour. Si algo no está listado, asuma que no está
              incluido y pregúntenos antes de reservar.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitación de responsabilidad</h2>
            <p>
              Como intermediario, {brand.businessName} no es responsable de accidentes, lesiones, pérdida de pertenencias o fallas en el
              servicio que ocurran durante la ejecución de un tour por parte de su operador. Nuestra responsabilidad se limita a la
              exactitud de la información que proporcionamos y a facilitar su reserva de buena fe.
            </p>
          </section>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Precios</h2>
            <p>Los precios mostrados en este sitio pueden cambiar sin previo aviso. Aplica el precio confirmado al momento de reservar.</p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
