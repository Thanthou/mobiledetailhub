import { useCallback } from 'react';

import { useAnalytics } from '@shared/hooks/useAnalytics';

import { quotesApi } from '../api/quotes.api';
import { type QuoteFormData, quoteRequestSchema } from '../types';

/**
 * Hook to handle quote form submission
 * Separates submission logic from form state
 */
export const useQuoteSubmission = () => {
  const { logEvent } = useAnalytics();
  const submitQuote = useCallback(async (
    formData: QuoteFormData,
    slug: string | undefined,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    try {
      // Validate form data with Zod schema
      const validatedData = quoteRequestSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        services: formData.services,
        vehicleType: formData.vehicleType,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        message: formData.message || undefined
      });

      const apiData = {
        ...validatedData,
        message: validatedData.message ?? '',
        businessSlug: slug ?? undefined
      };

      await quotesApi.submitQuoteRequest(apiData as Parameters<typeof quotesApi.submitQuoteRequest>[0]);
      logEvent('quote_submitted', {
        slug: slug || '',
        services_count: validatedData.services.length,
        vehicle_type: validatedData.vehicleType || '',
        city: validatedData.city || '',
      });
      onSuccess();
    } catch (err) {
      console.error('Quote submission error:', err);
      onError('Failed to submit quote. Please try again.');
    }
  }, [logEvent]);

  return {
    submitQuote
  };
};
