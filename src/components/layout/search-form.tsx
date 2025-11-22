'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import styles from './search-form.module.css';

type Locale = 'es' | 'en';

const PLACEHOLDER: Record<Locale, string> = {
  es: 'Buscar tours…',
  en: 'Search tours…',
};

const OPEN_LABEL: Record<Locale, string> = {
  es: 'Buscar',
  en: 'Search',
};

type SearchFormProps = {
  locale: Locale;
  /** `icon` — la lupa colapsable del header de escritorio. `inline` — el input siempre abierto arriba del drawer móvil. */
  variant: 'icon' | 'inline';
  onNavigate?: () => void;
};

/**
 * Manda a /tours?q=... y ahí se filtra la lista (ver ToursPage) contra
 * título y descripción corta. No hay backend de búsqueda de verdad —
 * con el catálogo chico de este negocio (HANDOFF §1, seis tours) filtrar
 * en memoria del lado del servidor alcanza de sobra.
 */
export function SearchForm({ locale, variant, onNavigate }: SearchFormProps) {
  const [open, setOpen] = useState(variant === 'inline');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (variant === 'icon' && open) inputRef.current?.focus();
  }, [open, variant]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/${locale}/tours?q=${encodeURIComponent(trimmed)}` : `/${locale}/tours`);
    onNavigate?.();
  };

  const isIcon = variant === 'icon';

  return (
    <form
      className={isIcon ? (open ? `${styles.iconForm} ${styles.open}` : styles.iconForm) : styles.inlineForm}
      onSubmit={submit}
      role="search"
    >
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={PLACEHOLDER[locale]}
        className={isIcon ? styles.iconInput : styles.inlineInput}
        onBlur={() => {
          if (isIcon && !value) setOpen(false);
        }}
      />
      <button
        type={isIcon && !open ? 'button' : 'submit'}
        className={isIcon ? styles.iconTrigger : styles.inlineTrigger}
        onClick={() => {
          if (isIcon && !open) setOpen(true);
        }}
        aria-label={OPEN_LABEL[locale]}
      >
        <span aria-hidden="true">🔍</span>
      </button>
    </form>
  );
}
