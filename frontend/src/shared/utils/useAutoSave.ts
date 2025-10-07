import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions {
  debounce?: number;
}

export function useAutoSave<T>(
  initialValue: T,
  saveFn: (value: T) => Promise<unknown>,
  options: UseAutoSaveOptions = {}
) {
  const { debounce = 800 } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);
  const previousInitialValue = useRef<T>(initialValue);

  // Reset value and first run flag if initialValue changes (e.g., after async load)
  // Only reset if the initialValue is actually different to prevent infinite loops
  useEffect(() => {
    if (previousInitialValue.current !== initialValue) {
      setValue(initialValue);
      isFirstRender.current = true;
      previousInitialValue.current = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    // Only trigger saveFn if this is not the initial mount or after initialValue changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsSaving(true);
    setError(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      void (async () => {
        try {
          await saveFn(value);
          setIsSaving(false);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to save';
          setError(errorMessage);
          setIsSaving(false);
        }
      })();
    }, debounce);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { value, setValue, isSaving, error };
}
