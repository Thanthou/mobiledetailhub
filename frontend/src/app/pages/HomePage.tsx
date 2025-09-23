import React from 'react';
import { Header } from '@/features/header';
import { Hero } from '@/features/hero';
import { ServicesGrid } from '@/features/services';
import { Reviews } from '@/features/reviews';
import { FAQ } from '@/features/faq';
import { Gallery } from '@/features/gallery';
import { useSiteContext } from '@/shared/hooks';

interface HomePageProps {
  onRequestQuote?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onRequestQuote }) => {
  const context = useSiteContext();

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll snap-container">
      <Header 
        locationData={context.locationData} 
        employeeData={context.employeeData} 
      />
      <Hero 
        locationData={context.locationData} 
        {...(onRequestQuote && { onRequestQuote })}
      />
      
      <ServicesGrid />
      
      <Reviews />
      
      <FAQ />
      
      <Gallery {...(onRequestQuote && { onRequestQuote })} />
    </div>
  );
};

export default HomePage;
