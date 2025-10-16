/**
 * Preview Async Operations Hook
 * Handles all async operations for preview functionality
 * Separated from Zustand store to maintain clean separation of concerns
 */

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { createPreview, verifyPreview } from '../api/preview.api';
import { usePreviewStore } from '../state/previewStore';
import type { PreviewPayload } from '../types/preview.types';

export interface PreviewGenerationResult {
  success: boolean;
  previewUrl?: string;
  error?: string;
}

export const usePreviewAsync = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Get store actions
  const { setLoading, setError, setPayload } = usePreviewStore();

  /**
   * Generate preview for given payload
   */
  const generatePreview = useCallback(async (payload: PreviewPayload): Promise<PreviewGenerationResult> => {
    setIsGenerating(true);
    setGenerationError(null);
    setLoading(true);
    setError(null);

    try {
      // Validate payload - properties are always defined in type
      // if (!payload.businessName || !payload.phone || !payload.industry) {
      //   throw new Error('Missing required preview data');
      // }

      // Generate preview using API
      const result = await createPreview(payload);
      
      if (result.success && result.url) {
        // Update store with generated preview
        setPayload({
          ...payload,
          previewUrl: result.url,
          generatedAt: new Date().toISOString(),
        });

        return {
          success: true,
          previewUrl: result.url
        };
      } else {
        throw new Error('Failed to generate preview');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate preview';
      setGenerationError(errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  }, [setLoading, setError, setPayload]);

  /**
   * Verify preview token
   */
  const verifyPreviewToken = useCallback(async (token: string): Promise<PreviewPayload | null> => {
    try {
      setLoading(true);
      setError(null);

      const payload = await verifyPreview(token);
      
      setPayload(payload);
      return payload;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify preview token';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPayload]);

  /**
   * Save preview configuration
   */
  const savePreviewConfig = useCallback(async (payload: PreviewPayload): Promise<boolean> => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update store
      setPayload(payload);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preview configuration';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPayload]);

  /**
   * Clear preview data
   */
  const clearPreview = useCallback(() => {
    setError(null);
    setGenerationError(null);
    setIsGenerating(false);
  }, [setError]);

  return {
    // State
    isGenerating,
    generationError,
    
    // Actions
    generatePreview,
    verifyPreviewToken,
    savePreviewConfig,
    clearPreview,
  };
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
