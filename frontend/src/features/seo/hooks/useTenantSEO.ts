/**
 * Hook for managing tenant SEO configuration
 */

import { useEffect, useState } from 'react';

import { fetchSEO, updateSEO } from '../api/seo.api';
import type { SEOConfig, SEOUpdateRequest } from '../types/seo.types';

export const useTenantSEO = () => {
  const [seo, setSeo] = useState<SEOConfig>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSEO = async () => {
      try {
        setLoading(true);
        const seoData = await fetchSEO();
        setSeo(seoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load SEO data');
      } finally {
        setLoading(false);
      }
    };

    void loadSEO();
  }, []);

  const save = async (field: string, value: string | string[]) => {
    try {
      const updated = { ...seo, [field]: value };
      setSeo(updated);
      await updateSEO(updated as SEOUpdateRequest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save SEO data');
      // Revert on error
      setSeo(seo);
    }
  };

  return { seo, save, loading, error };
};
