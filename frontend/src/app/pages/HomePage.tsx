import React from 'react';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { ServicesGrid } from '@/features/services';
import { Reviews } from '@/features/reviews';
import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { useSiteContext } from '@/shared/hooks';

const HomePage: React.FC = () => {
  const context = useSiteContext();

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
      <Header 
        locationData={context.locationData} 
        employeeData={context.employeeData} 
      />
      <Hero locationData={context.locationData} />
      
      <ServicesGrid />
      
      <Reviews />
      
      <FAQ />
      
      <Gallery onRequestQuote={() => console.log('Request Quote clicked')} />
    </div>
  );
};

export default HomePage;
