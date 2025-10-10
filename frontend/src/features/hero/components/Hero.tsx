import React from 'react';

import { useHeroContent } from '@/features/hero/hooks/useHeroContent';
import type { LocationPage } from '@/shared/types/location';

import ContentContainer from './ContentContainer';
import ImageCarousel from './ImageCarousel';

interface HeroProps {
  locationData?: LocationPage;
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
