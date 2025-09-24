import React from 'react';
import ImageCarousel from './ImageCarousel';
import ContentContainer from './ContentContainer';
import { useHeroContent } from '@/features/hero/hooks/useHeroContent';

interface HeroProps {
  locationData?: any; // Location-specific data including images and content
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ locationData, onRequestQuote }) => {
  const { title, subtitle, isLocation, locationName } = useHeroContent({ locationData });

  return (
    <section id="top" className="relative h-dvh overflow-hidden snap-start snap-always">
      <ImageCarousel locationData={locationData} />
      
      <main id="main" className="relative z-10 h-full">
        <ContentContainer 
          title={title} 
          subtitle={subtitle} 
          isLocation={isLocation}
          locationName={locationName}
          onRequestQuote={onRequestQuote}
          className="h-full"
        />
      </main>
    </section>
  );
};

export default Hero;
