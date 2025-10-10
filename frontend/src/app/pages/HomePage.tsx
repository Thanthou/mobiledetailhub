import React, { useEffect } from 'react';

import { FAQ } from '@/features/faq';
import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { Gallery } from '@/features/gallery';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { Reviews } from '@/features/reviews';
import { useReviewsAvailability } from '@/features/reviews/hooks/useReviewsAvailability';
import { ServicesGrid } from '@/features/services';
import { useSEO } from '@/shared/hooks/useSEO';
import { convertFAQItemsToSchemaFormat, injectAllSchemas } from '@/shared/utils/schemaUtils';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: unknown;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  // Legacy useSiteContext removed - now using tenant-based routing
  
  // Update SEO metadata (title, description, etc.)
  useSEO();
  
  // Check if reviews are available for this site
  const hasReviews = useReviewsAvailability();

  // Generate and inject Schema.org JSON-LD for tenant site
  useEffect(() => {
    if (!locationData) {
      // Generate schema for tenant site using static site data
      const generalFAQs = convertFAQItemsToSchemaFormat(MDH_FAQ_ITEMS);
      injectAllSchemas([generalFAQs]);
    }
  }, [locationData]);

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
      <Header />
      <Hero 
        {...(onRequestQuote && { onRequestQuote })}
      />
      
      <ServicesGrid />
      
              {/* Only show reviews if there are reviews available */}
              {hasReviews && (
                <Reviews />
              )}
      
      <FAQ />
      
      <Gallery 
        {...(onRequestQuote && { onRequestQuote })}
      />
    </div>
  );
};

export default HomePage;
