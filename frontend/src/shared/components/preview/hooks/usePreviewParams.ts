/**
 * usePreviewParams Hook
 * 
 * Reads preview parameters from URL (either token or individual params),
 * validates them, and hydrates the preview store.
 * 
 * Supports two modes:
 * 1. Token mode: ?t=<jwt>
 * 2. URL params mode: ?name=&phone=&industry= (for quick testing)
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { safeErrorMessage, safeValidationMessage } from '@shared/utils/errorHandling';

import { verifyPreview } from '../api/preview.api';
import { usePreviewStore } from '../state/previewStore';
import type { PreviewPayload } from '../types/preview.types';
import { PreviewPayloadSchema } from '../types/preview.types';

interface UsePreviewParamsResult {
  payload: PreviewPayload | null;
  isLoading: boolean;
  error: string | null;
}

export function usePreviewParams(): UsePreviewParamsResult {
  const [searchParams] = useSearchParams();
  const { payload, isLoading, error, setPayload, setLoading, setError } = usePreviewStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized) return;
    setHasInitialized(true);

    async function loadPreview() {
      setLoading(true);
      setError(null);

      try {
        // Check if token mode is used
        const token = searchParams.get('t');
        const expectedTenantId = searchParams.get('tenant_id') || undefined;

        if (token) {
          // Token mode: verify with backend
          const verifiedPayload = await verifyPreview(token, expectedTenantId || undefined);
          setPayload(verifiedPayload);
          return;
        }

        // URL params mode: validate and use directly
        const name = searchParams.get('name');
        const phone = searchParams.get('phone');
        const city = searchParams.get('city');
        const state = searchParams.get('state');
        const industry = searchParams.get('industry');

        if (!name || !phone || !city || !state || !industry) {
          throw new Error('Missing required parameters. Please use a valid preview link.');
        }

        const validation = PreviewPayloadSchema.safeParse({
          businessName: name,
          phone,
          city,
          state: state.toUpperCase(),
          industry,
        });

        if (!validation.success) {
          throw new Error(safeValidationMessage(validation.error));
        }

        setPayload(validation.data);
      } catch (err: unknown) {
        setError(safeErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    void loadPreview();
  }, [searchParams, hasInitialized, setPayload, setLoading, setError]);

  return {
    payload,
    isLoading,
    error,
  };
}

