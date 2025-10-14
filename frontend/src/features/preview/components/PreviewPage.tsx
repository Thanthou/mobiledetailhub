/**
 * Preview Page
 * 
 * Displays a preview of a tenant site with injected business info.
 * Used for sales demos - no tenant record is created yet.
 */

import React, { useEffect, useState } from 'react';

import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { LazyRequestQuoteModal } from '@/features/quotes';
import { Reviews } from '@/features/reviews';
import { ServicesGrid } from '@/features/services';
import { useBrowserTab } from '@/shared/hooks';

import { usePreviewParams } from '../hooks/usePreviewParams';
import { PreviewCTAButton } from './PreviewCTAButton';
import { PreviewDataProvider } from './PreviewDataProvider';
import { PreviewError } from './PreviewError';
import { PreviewLoading } from './PreviewLoading';

const PreviewPage: React.FC = () => {
  const { payload, isLoading, error } = usePreviewParams();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenQuoteModal = () => {
    setIsQuoteModalOpen(true);
  };
  
  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  // Update browser tab title with business name
  useBrowserTab({
    title: payload?.businessName ? `${payload.businessName} - Preview` : 'Platform Preview',
    useBusinessName: false, // Don't use default business name, we have custom format
  });

  // Loading state
  if (isLoading) {
    return <PreviewLoading />;
  }

  // Error state
  if (error || !payload) {
    return <PreviewError error={error || 'Failed to load preview'} />;
  }

  // Render preview with injected data
  return (
    <PreviewDataProvider payload={payload}>
      {/* Fixed "Get This Site" buttons in both corners */}
      <PreviewCTAButton position="left" />
      <PreviewCTAButton position="right" />
      
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
        {/* Regular site components - they'll get preview data from context */}
        <Header />
        <Hero onRequestQuote={handleOpenQuoteModal} />
        <ServicesGrid />
        <Reviews />
        <FAQ />
        <Gallery onRequestQuote={handleOpenQuoteModal} />
      </div>
      
      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <LazyRequestQuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={handleCloseQuoteModal} 
        />
      )}
    </PreviewDataProvider>
  );
};

export default PreviewPage;

