import React from 'react';
import ImageCarousel from './ImageCarousel';
import ContentContainer from './ContentContainer';
import { useHeroContent } from '@/features/hero/hooks/useHeroContent';

interface HeroProps {
  locationData?: any; // Keep for backward compatibility but not used
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRequestQuote }) => {
  const { title, subtitle, isLocation, locationName } = useHeroContent();

  return (
    <section id="top" className="relative h-dvh overflow-hidden snap-start snap-always">
      <ImageCarousel />
      
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
