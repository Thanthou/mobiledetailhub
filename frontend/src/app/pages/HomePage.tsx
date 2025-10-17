import React, { useEffect } from 'react';

import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { Reviews } from '@/features/reviews';
import { useReviewsAvailability } from '@/features/reviews/hooks/useReviewsAvailability';
import { ServicesGrid } from '@/features/services';
import { useIsDesktop, useScrollSpy, useSEO, useTenantSlug } from '@/shared/hooks';
import type { SectionId } from '@/shared/state/sectionStore';
import { injectAllSchemas } from '@/shared/utils/schemaUtils';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: unknown;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  // Legacy useSiteContext removed - now using tenant-based routing
  
  // Get tenant slug from URL
  const tenantSlug = useTenantSlug();
  
  // Update SEO metadata (title, description, etc.)
  useSEO();
  
  // Check if reviews are available for this site
  const hasReviews = useReviewsAvailability();
  
  // Determine which section IDs to track based on screen size
  const isDesktop = useIsDesktop();
  
  // Set up scroll spy to track active section - use correct IDs for mobile vs desktop
  const sectionIds: SectionId[] = isDesktop 
    ? ['top', 'services-desktop', 'reviews', 'faq', 'gallery-desktop']
    : ['top', 'services', 'reviews', 'faq', 'gallery', 'footer'];
  
  useScrollSpy({ 
    ids: sectionIds, 
    headerPx: isDesktop ? 88 : 72, 
    updateHash: false 
  });

  // Generate and inject Schema.org JSON-LD for tenant site
  useEffect(() => {
    if (!locationData) {
      // Schema generation for FAQs is now handled by the FAQ component itself
      // using industry-specific data loaded dynamically
      injectAllSchemas([]);
    }
  }, [locationData]);

  return (
    <>
      <Header />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container scrollbar-hide pt-[72px] md:pt-[88px]">
        <Hero 
          {...(onRequestQuote && { onRequestQuote })}
        />
      
      <ServicesGrid />
      
              {/* Only show reviews if there are reviews available */}
              {hasReviews && (
                <Reviews tenantSlug={tenantSlug} />
              )}
      
      <FAQ />
      
      <Gallery 
        {...(onRequestQuote && { onRequestQuote })}
      />
      </div>
    </>
  );
};

export default HomePage;
