import React, { useEffect } from 'react';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { ServicesGrid } from '@/features/services';
import { Reviews } from '@/features/reviews';
import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { useSiteContext } from '@/shared/hooks';
import { generateAllSchemas, injectAllSchemas } from '@/shared/utils/schemaUtils';

interface HomePageProps {
  onRequestQuote?: () => void;
  locationData?: any;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote, locationData }) => {
  const context = useSiteContext();

  // Generate and inject Schema.org JSON-LD for main site
  useEffect(() => {
    if (!locationData) {
      // Only inject main site schema when not on a location page
      const siteData = context.siteData;
      if (siteData) {
        const schemas = generateAllSchemas(siteData, 'home');
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
      
      <Reviews 
        locationData={locationData || context.locationData}
      />
      
      <FAQ locationData={locationData || context.locationData} />
      
      <Gallery 
        {...(onRequestQuote && { onRequestQuote })}
        locationData={locationData || context.locationData}
      />
    </div>
  );
};

export default HomePage;
