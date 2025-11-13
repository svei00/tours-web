import { useCallback, useState, type ChangeEvent } from 'react';
import { TextArea, TextInput } from '@sanity/ui';
import { PatchEvent, set, type ObjectInputProps } from 'sanity';

import { translateToEnglish } from '../lib/translate-action';

type LocaleFieldValue = {
  es?: string;
  en?: string;
  enIsMachineDraft?: boolean;
};

/**
 * Input compartido de los objetos localeString y localeText: un campo en
 * español, uno en inglés, y un botón que traduce del español con DeepL.
 *
 * La insignia "traducción automática sin revisar" (HANDOFF §5, regla 3) se
 * prende sola cuando se usa el botón, y se apaga sola en cuanto alguien
 * edita el inglés a mano — esa edición manual ES la señal de que un humano
 * ya lo revisó, así que no hace falta un botón aparte para "marcar como
 * revisado".
 *
 * Usa HTML simple en vez de los layouts de @sanity/ui (Stack/Flex/Text/
 * Badge/Button): esos componentes son genéricos y polimórficos (aceptan un
 * prop `as`), y esa combinación con esta versión de TypeScript resuelve mal
 * el tipo de sus props. TextInput/TextArea sí se usan porque son funciones
 * normales, no genéricas, y dan el look nativo del Studio en los campos.
 */
export function LocaleFieldInput(props: ObjectInputProps<LocaleFieldValue>) {
  const { value, onChange, schemaType } = props;
  const isMultiline = schemaType.name === 'localeText';
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const esValue = value?.es ?? '';
  const enValue = value?.en ?? '';
  const isMachineDraft = Boolean(value?.enIsMachineDraft);

  const handleEsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(set(event.currentTarget.value, ['es']));
    },
    [onChange],
  );

  const handleEnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(
        PatchEvent.from([set(event.currentTarget.value, ['en']), set(false, ['enIsMachineDraft'])]),
      );
    },
    [onChange],
  );

  const handleTranslateClick = useCallback(async () => {
    if (!esValue) return;
    setIsTranslating(true);
    setTranslateError(null);
    try {
      const translated = await translateToEnglish(esValue);
      onChange(PatchEvent.from([set(translated, ['en']), set(true, ['enIsMachineDraft'])]));
    } catch {
      setTranslateError('No se pudo traducir. Revisa tu conexión o escribe el inglés a mano.');
    } finally {
      setIsTranslating(false);
    }
  }, [esValue, onChange]);

  const FieldInput = isMultiline ? TextArea : TextInput;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Español</span>
        <FieldInput value={esValue} onChange={handleEsChange} rows={isMultiline ? 3 : undefined} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Inglés</span>
          {isMachineDraft && (
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.125rem 0.5rem',
                borderRadius: '999px',
                background: '#fef3c7',
                color: '#92400e',
              }}
            >
              Traducción automática sin revisar
            </span>
          )}
        </div>
        <FieldInput value={enValue} onChange={handleEnChange} rows={isMultiline ? 3 : undefined} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            disabled={!esValue || isTranslating}
            onClick={handleTranslateClick}
            style={{
              fontSize: '0.8125rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid currentColor',
              background: 'transparent',
              cursor: !esValue || isTranslating ? 'not-allowed' : 'pointer',
              opacity: !esValue || isTranslating ? 0.5 : 1,
            }}
          >
            {isTranslating ? 'Traduciendo…' : 'Traducir del español'}
          </button>
          {translateError && (
            <span style={{ fontSize: '0.8125rem', opacity: 0.7 }}>{translateError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
