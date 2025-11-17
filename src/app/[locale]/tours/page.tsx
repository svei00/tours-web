import type { Metadata } from 'next';

import { EmptyState } from '@/components/tour/empty-state';
import { TagFilterBar } from '@/components/tour/tag-filter-bar';
import { TourGrid } from '@/components/tour/tour-grid';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { getTagList, getTourList } from '@/lib/sanity/tours';
import type { Locale } from '@/lib/sanity/types';

import styles from './page.module.css';

const SUPPORTED_LOCALES = ['es', 'en'] as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

const COPY: Record<Locale, { title: string }> = {
  es: { title: 'Nuestros tours' },
  en: { title: 'Our tours' },
};

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: COPY[locale as Locale].title };
}

export default async function ToursPage({ params }: PageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const [tours, tags] = await Promise.all([getTourList(), getTagList()]);

  return (
    <Section>
      <Container>
        <div className={styles.header}>
          <h1 className="font-headline">{COPY[typedLocale].title}</h1>
          <TagFilterBar tags={tags} locale={typedLocale} />
        </div>
        {tours.length === 0 ? <EmptyState locale={typedLocale} /> : <TourGrid tours={tours} locale={typedLocale} />}
      </Container>
    </Section>
  );
}
