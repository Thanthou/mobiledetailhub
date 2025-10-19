import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useTenantConfigLoader } from '@/shared/hooks';

/**
 * Hook to manage location page state and interactions
 * Handles quote modals, booking navigation, and tenant detection
 */
export function useLocationPageState() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams<{ slug?: string; businessSlug?: string; tenantSlug?: string }>();
  const queryClient = useQueryClient();
  
  // Get business slug from URL params
  const businessSlug = params.slug || params.businessSlug || params.tenantSlug || '';
  
  // Load tenant config to determine if this is an affiliate
  const { data: tenantConfig } = useTenantConfigLoader({ slug: businessSlug });
  const isAffiliate = (tenantConfig?.isAffiliate as boolean | undefined) ?? false;

  const handleOpenQuoteModal = useCallback(() => {
    setIsQuoteModalOpen(true);
  }, []);

  const handleCloseQuoteModal = useCallback(() => {
    setIsQuoteModalOpen(false);
  }, []);

  const handleBookNow = useCallback(() => {
    // Navigate to booking page
    if (businessSlug) {
      void navigate(`/${businessSlug}/booking`);
    } else {
      void navigate('/booking');
    }
  }, [businessSlug, navigate]);

  const handleQuoteModalPrefetch = useCallback(() => {
    // Prefetch quote modal dependencies
    // This is called on hover to prepare the modal
    void queryClient.prefetchQuery({
      queryKey: ['quote-modal-prefetch'],
      queryFn: () => {
        // Prefetch any data needed for the quote modal
        return Promise.resolve(null);
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  return {
    isAffiliate,
    businessSlug,
    isQuoteModalOpen,
    handleOpenQuoteModal,
    handleCloseQuoteModal,
    handleBookNow,
    handleQuoteModalPrefetch,
  };
}

