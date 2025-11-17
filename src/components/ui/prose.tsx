import { PortableText, type PortableTextComponents } from '@portabletext/react';

import type { PortableTextBlock } from '@/lib/sanity/types';

import styles from './prose.module.css';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
};

/** Renderiza `longDescription.es`/`.en` (Portable Text). Nada si está vacío. */
export function Prose({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value || value.length === 0) return null;

  return (
    <div className={styles.prose}>
      <PortableText value={value} components={components} />
    </div>
  );
}
