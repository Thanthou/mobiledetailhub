/**
 * Preview Async Operations Hook
 * Handles all async operations for preview functionality
 * Separated from Zustand store to maintain clean separation of concerns
 */

import { useQuery } from '@tanstack/react-query';
import { usePreviewAsyncCore } from '@shared/hooks/usePreviewAsyncCore';
import { createPreview, verifyPreview } from '../api/preview.api';
import { usePreviewStore } from '../state/previewStore';
import type { PreviewPayload } from '../types/preview.types';

export interface PreviewGenerationResult {
  success: boolean;
  previewUrl?: string;
  error?: string;
}

export const usePreviewAsync = () => {
  const { setLoading, setError, setPayload } = usePreviewStore();

  const core = usePreviewAsyncCore(
    {
      createPreview: async (payload) => createPreview(payload as PreviewPayload),
      verifyPreview: async (token) => verifyPreview(token) as unknown as PreviewPayload,
    },
    { setLoading, setError, setPayload }
  );

  return core;
};

/**
 * Hook for preview data persistence
 */
export const usePreviewPersistence = () => {
  const { payload } = usePreviewStore();
  const { savePreviewConfig } = usePreviewAsync();

  // Auto-save preview data when it changes
  const { data: autoSaveEnabled } = useQuery({
    queryKey: ['preview','autoSave', payload],
    queryFn: async () => {
      if (payload) {
        await savePreviewConfig(payload);
      }
      return true;
    },
    enabled: !!payload,
    staleTime: 10000, // 10 seconds
  });

  return {
    autoSaveEnabled,
    hasPreviewData: !!payload,
  };
};
