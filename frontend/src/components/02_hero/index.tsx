import React from 'react';
import { useSiteContext } from '../../hooks/useSiteContext';
import HeroBackground from './components/HeroBackground';
import MDH from './mdh/Hero';
import AFFILIATE from './affiliate/Hero';

const Hero: React.FC = () => {
  const { isMDH } = useSiteContext();

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-end pb-12">
      <HeroBackground />
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
        {isMDH ? <MDH /> : <AFFILIATE />}
      </div>
    </section>
  );
};

export default Hero;