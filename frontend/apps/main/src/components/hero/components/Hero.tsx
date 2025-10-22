import React from 'react';

import SmartHero from './SmartHero';

interface HeroProps {
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = () => {
  return (
    <section 
      id="top" 
      className="snap-start snap-always"
    >
      <SmartHero />
    </section>
  );
};

export default Hero;
