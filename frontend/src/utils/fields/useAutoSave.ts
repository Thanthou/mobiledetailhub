import { useState, useRef, useEffect } from 'react';

interface UseAutoSaveOptions {
  debounce?: number;
}

export function useAutoSave<T>(
  initialValue: T,
  saveFn: (value: T) => Promise<any>,
  options: UseAutoSaveOptions = {}
) {
  const { debounce = 800 } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  // Reset value and first run flag if initialValue changes (e.g., after async load)
  useEffect(() => {
    setValue(initialValue);
    isFirstRender.current = true;
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
    timeoutRef.current = window.setTimeout(async () => {
      try {
        await saveFn(value);
        setIsSaving(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to save');
        setIsSaving(false);
      }
    }, debounce);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { value, setValue, isSaving, error };
}
