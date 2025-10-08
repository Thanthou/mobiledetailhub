import React, { useEffect } from 'react';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { ServicesGrid } from '@/features/services';
import { Reviews } from '@/features/reviews';
import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
// Legacy useSiteContext removed - now using tenant-based routing
import { generateAllSchemas, injectAllSchemas, convertFAQItemsToSchemaFormat } from '@/shared/utils/schemaUtils';
import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { useReviewsAvailability } from '@/features/reviews/hooks/useReviewsAvailability';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  // Legacy useSiteContext removed - now using tenant-based routing
  
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
