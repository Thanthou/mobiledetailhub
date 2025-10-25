/**
 * Preview Page
 * 
 * Displays a preview of a tenant site with injected business info.
 * Used for sales demos - no tenant record is created yet.
 */

import React from 'react';

import { FAQ } from '@shared/components/faq';
// Note: Gallery, Services, Hero, Header, Quotes, and Reviews removed - use app-specific implementations
import { useBrowserTab, useIsDesktop, useScrollSpy } from '@shared/hooks';
import { SeoHead } from '@shared/seo';
import type { SectionId } from '@shared/state/sectionStore';

import { usePreviewParams } from '../hooks/usePreviewParams';
import { PreviewCTAButton } from './PreviewCTAButton';
import { PreviewDataProvider } from './PreviewDataProvider';
import { PreviewError } from './PreviewError';
import { PreviewLoading } from './PreviewLoading';

const PreviewPage: React.FC = () => {
  const { payload, isLoading, error } = usePreviewParams();
  const isDesktop = useIsDesktop();

  // Update browser tab title with business name
  useBrowserTab({
    title: payload?.businessName ? `${payload.businessName} - Preview` : 'Platform Preview',
    useBusinessName: false, // Don't use default business name, we have custom format
  });

  // Section tracking for scroll spy
  const sectionIds: SectionId[] = isDesktop 
    ? ['top', 'services', 'services-desktop', 'reviews', 'faq', 'gallery', 'gallery-desktop', 'footer']
    : ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
  
  useScrollSpy({ 
    ids: sectionIds, 
    headerPx: isDesktop ? 88 : 72, 
    updateHash: false 
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
      {/* SEO Head with noindex for preview pages */}
      <SeoHead 
        title={payload.businessName ? `${payload.businessName} - Preview` : 'Platform Preview'}
        description={`Preview of ${payload.businessName || 'business'} website`}
        noindex={true}
      />
      
      {/* Fixed "Get This Site" buttons in both corners */}
      <PreviewCTAButton position="left" />
      <PreviewCTAButton position="right" />
      
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
        {/* Regular site components - they'll get preview data from context */}
        {/* Header, Hero, and Reviews removed - use app-specific implementations */}
        <FAQ />
        {/* Gallery removed - use app-specific implementations */}
      </div>
      
      {/* Quote Modal removed - use app-specific implementations */}
    </PreviewDataProvider>
  );
};

export default PreviewPage;

