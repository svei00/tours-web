'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type FocusEvent } from 'react';

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
  /** `icon` — la lupa del header de escritorio, abre un dropdown flotante. `inline` — el input siempre abierto arriba del drawer móvil. */
  variant: 'icon' | 'inline';
  onNavigate?: () => void;
};

/**
 * Manda a /tours?q=... y ahí se filtra la lista (ver ToursPage) contra
 * título y descripción corta. No hay backend de búsqueda de verdad —
 * con el catálogo chico de este negocio (HANDOFF §1, seis tours) filtrar
 * en memoria del lado del servidor alcanza de sobra.
 *
 * La variante `icon` abre un dropdown en `position: absolute` en vez de
 * expandirse in-line en la fila del header -- la primera versión
 * empujaba el input dentro de la misma fila que el nav y las demás
 * acciones, y a anchos intermedios (~768–950px) no cabía todo: el input
 * terminaba encimado con el selector de idioma. Un dropdown flotante no
 * le pelea espacio a nadie, a ningún ancho.
 */
export function SearchForm({ locale, variant, onNavigate }: SearchFormProps) {
  const [open, setOpen] = useState(variant === 'inline');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isIcon = variant === 'icon';

  useEffect(() => {
    if (isIcon && open) inputRef.current?.focus();
  }, [open, isIcon]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/${locale}/tours?q=${encodeURIComponent(trimmed)}` : `/${locale}/tours`);
    onNavigate?.();
    setOpen(false);
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    if (isIcon && !event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  if (!isIcon) {
    return (
      <form className={styles.inlineForm} onSubmit={submit} role="search">
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={PLACEHOLDER[locale]}
          className={styles.inlineInput}
        />
        <button type="submit" className={styles.inlineTrigger} aria-label={OPEN_LABEL[locale]}>
          <span aria-hidden="true">🔍</span>
        </button>
      </form>
    );
  }

  return (
    <form className={styles.iconForm} onSubmit={submit} onBlur={handleBlur} role="search">
      <button
        type="button"
        className={styles.iconTrigger}
        onClick={() => setOpen((current) => !current)}
        aria-label={OPEN_LABEL[locale]}
        aria-expanded={open}
      >
        <span aria-hidden="true">🔍</span>
      </button>
      <div className={open ? `${styles.dropdown} ${styles.open}` : styles.dropdown}>
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={PLACEHOLDER[locale]}
          className={styles.dropdownInput}
          tabIndex={open ? 0 : -1}
        />
        <button type="submit" className={styles.dropdownSubmit} aria-label={OPEN_LABEL[locale]} tabIndex={open ? 0 : -1}>
          <span aria-hidden="true">🔍</span>
        </button>
      </div>
    </form>
  );
}
