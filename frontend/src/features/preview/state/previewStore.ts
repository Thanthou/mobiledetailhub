/**
 * Preview Store
 * 
 * Zustand store for managing preview state.
 * Holds the current preview payload (businessName, phone, industry).
 */

import { create } from 'zustand';

import type { PreviewPayload } from '../types/preview.types';

interface PreviewState {
  payload: PreviewPayload | null;
  isLoading: boolean;
  error: string | null;
  setPayload: (payload: PreviewPayload) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  payload: null,
  isLoading: false,
  error: null,
  
  setPayload: (payload) =>
    set({
      payload,
      error: null,
    }),
  
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
  
  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),
  
  clearPreview: () =>
    set({
      payload: null,
      error: null,
      isLoading: false,
    }),
}));

