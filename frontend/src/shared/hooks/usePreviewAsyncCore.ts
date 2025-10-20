import { useCallback, useState } from 'react';

export interface PreviewPayloadLike {
  // Use index signature to remain app-agnostic while preserving type-safety in app wrappers
  [key: string]: unknown;
}

export interface PreviewApi {
  createPreview: (payload: PreviewPayloadLike) => Promise<{ success: boolean; url?: string }>;
  verifyPreview: (token: string) => Promise<PreviewPayloadLike>;
}

export interface PreviewStoreActions {
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setPayload: (payload: PreviewPayloadLike) => void;
}

export interface PreviewGenerationResult {
  success: boolean;
  previewUrl?: string;
  error?: string;
}

export function usePreviewAsyncCore(api: PreviewApi, store: PreviewStoreActions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const generatePreview = useCallback(async (payload: PreviewPayloadLike): Promise<PreviewGenerationResult> => {
    store.setLoading(true);
    store.setError(null);
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await api.createPreview(payload);
      if (result.success && result.url) {
        store.setPayload({ ...payload, previewUrl: result.url, generatedAt: new Date().toISOString() });
        return { success: true, previewUrl: result.url };
      }
      throw new Error('Failed to generate preview');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate preview';
      setGenerationError(errorMessage);
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
      store.setLoading(false);
    }
  }, [api, store]);

  const verifyPreviewToken = useCallback(async (token: string): Promise<PreviewPayloadLike | null> => {
    try {
      store.setLoading(true);
      store.setError(null);
      const payload = await api.verifyPreview(token);
      store.setPayload(payload);
      return payload;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify preview token';
      store.setError(errorMessage);
      return null;
    } finally {
      store.setLoading(false);
    }
  }, [api, store]);

  const savePreviewConfig = useCallback(async (payload: PreviewPayloadLike): Promise<boolean> => {
    try {
      store.setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      store.setPayload(payload);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save preview configuration';
      store.setError(errorMessage);
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const clearPreview = useCallback(() => {
    store.setError(null);
    setGenerationError(null);
    setIsGenerating(false);
  }, [store]);

  return {
    isGenerating,
    generationError,
    generatePreview,
    verifyPreviewToken,
    savePreviewConfig,
    clearPreview,
  } as const;
}


