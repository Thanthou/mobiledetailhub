import React, { useEffect } from 'react';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { ServicesGrid } from '@/features/services';
import { Reviews } from '@/features/reviews';
import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { useSiteContext } from '@/shared/hooks';
import { generateAllSchemas, injectAllSchemas, convertFAQItemsToSchemaFormat } from '@/shared/utils/schemaUtils';
import { MDH_FAQ_ITEMS } from '@/features/faq/utils';
import { useReviewsAvailability } from '@/features/reviews/hooks/useReviewsAvailability';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  const context = useSiteContext();
  
  // Check if reviews are available for this site
  const hasReviews = useReviewsAvailability();

  // Generate and inject Schema.org JSON-LD for tenant site
  useEffect(() => {
    if (!locationData) {
      // Generate schema for tenant site
      const siteData = context.siteData;
      if (siteData) {
        // Convert general FAQs to schema format
        const generalFAQs = convertFAQItemsToSchemaFormat(MDH_FAQ_ITEMS);
        const schemas = generateAllSchemas(siteData, 'home', generalFAQs);
        injectAllSchemas(schemas);
      }
    }
  }, [locationData, context.siteData]);

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
      <Header 
        locationData={locationData || context.locationData} 
        employeeData={context.employeeData} 
      />
      <Hero 
        locationData={locationData || context.locationData} 
        {...(onRequestQuote && { onRequestQuote })}
      />
      
      <ServicesGrid locationData={locationData || context.locationData} />
      
              {/* Only show reviews if there are reviews available */}
              {hasReviews && (
                <Reviews 
                  locationData={locationData || context.locationData}
                />
              )}
      
      <FAQ locationData={locationData || context.locationData} />
      
      <Gallery 
        {...(onRequestQuote && { onRequestQuote })}
        locationData={locationData || context.locationData}
      />
    </div>
  );
};

export default HomePage;
