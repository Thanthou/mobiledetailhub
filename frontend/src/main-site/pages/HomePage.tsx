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
import { defaultSchemas } from '@/shared/seo/defaultSchemas';

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
  
  // Check if reviews are available for this site (only for tenant sites)
  const hasReviews = tenantSlug ? useReviewsAvailability() : false;
  
  // Determine which section IDs to track based on screen size
  const isDesktop = useIsDesktop();
  
  // Set up scroll spy to track active section - use correct IDs for mobile vs desktop
  const sectionIds: SectionId[] = isDesktop 
    ? hasReviews 
      ? ['top', 'services-desktop', 'reviews', 'faq', 'gallery-desktop']
      : ['top', 'services-desktop', 'faq', 'gallery-desktop']
    : hasReviews
      ? ['top', 'services', 'reviews', 'faq', 'gallery', 'footer']
      : ['top', 'services', 'faq', 'gallery', 'footer'];
  
  useScrollSpy({ 
    ids: sectionIds, 
    headerPx: isDesktop ? 88 : 72, 
    updateHash: false 
  });

  // Generate and inject Schema.org JSON-LD for tenant site
  useEffect(() => {
    if (locationData) {
      // Use tenant-specific schemas when location data is available
      // This will be handled by the existing schema generation logic
      injectAllSchemas([]);
    } else {
      // Use default platform schemas when no tenant data is available
      injectAllSchemas(defaultSchemas);
    }
  }, [locationData]);

  // If this is the main platform site (no tenant), show platform landing page
  if (!tenantSlug) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-900 text-white pt-[72px] md:pt-[88px]">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
              That Smart Site
            </h1>
            <p className="text-xl md:text-2xl text-center mb-12 text-gray-300">
              Professional website platform for local service businesses
            </p>
            <div className="text-center">
              <a 
                href="/tenant-onboarding" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                Get Started - Create Your Site
              </a>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Mobile Detailing</h3>
                <p className="text-gray-300">Professional car detailing services</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Maid Service</h3>
                <p className="text-gray-300">Residential and commercial cleaning</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Lawn Care</h3>
                <p className="text-gray-300">Landscaping and maintenance services</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If this is a tenant site, show tenant-specific content
  return (
    <>
      <Header />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container scrollbar-hide pt-[72px] md:pt-[88px]">
        <h1 className="sr-only">Professional Services</h1>
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
