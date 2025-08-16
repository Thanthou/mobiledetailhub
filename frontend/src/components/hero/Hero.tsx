import React from 'react';
import Header from '../Header';
import { useBusinessConfig } from '../../hooks/useBusinessConfig';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroLoadingState from './HeroLoadingState';
import HeroErrorState from './HeroErrorState';

interface HeroProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow, onRequestQuote }) => {
  const { businessConfig, isLoading, error } = useBusinessConfig();

  // Show loading state while waiting for config
  if (isLoading || !businessConfig) {
    return <HeroLoadingState />;
  }

  if (error) {
    return <HeroErrorState error={error} />;
  }

  return (
    <section className="hero-section flex items-end justify-center relative overflow-visible z-[100]">
      {/* Header Overlay */}
      <Header />
      
      {/* Hero Background Image Rotator */}
      <HeroBackground />
      
      {/* Content */}
      <HeroContent 
        businessConfig={businessConfig}
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
      />
    </section>
  );
};

export default Hero;