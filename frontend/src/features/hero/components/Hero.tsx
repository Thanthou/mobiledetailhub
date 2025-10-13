import React from 'react';

import { useHeroContent } from '@/features/hero/hooks/useHeroContent';

import ContentContainer from './ContentContainer';
import ImageCarousel from './ImageCarousel';

interface HeroProps {
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRequestQuote }) => {
  const { title, subtitle } = useHeroContent({});

  return (
    <section 
      id="top" 
      className="relative isolate overflow-hidden h-[100dvh] sm:h-screen flex items-end justify-center snap-start snap-always"
    >
      {/* Background layer - carousel */}
      <div className="absolute inset-0 -z-10" style={{ top: '-72px', height: 'calc(100% + 72px)' }}>
        <ImageCarousel />
      </div>
      
      {/* Foreground content */}
      <main
        id="main"
        className="relative z-10 w-full"
        style={{ 
          marginTop: '72px',
          paddingBottom: window.innerWidth < 640 ? '56px' : '7rem'
        }}
      >
        <ContentContainer 
          title={title} 
          subtitle={subtitle}
          {...(onRequestQuote && { onRequestQuote })}
          className=""
        />
      </main>
    </section>
  );
};

export default Hero;
