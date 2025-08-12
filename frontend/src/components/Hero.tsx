import React, { useState, useEffect } from 'react';
import Header from './Header';
import CTAButtonsContainer from './shared/CTAButtonsContainer';
import { useBusinessConfig } from '../hooks/useBusinessConfig';

interface HeroProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow, onRequestQuote }) => {
  const { businessConfig, isLoading, error } = useBusinessConfig();
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    // Wait for theme to be properly set
    const checkTheme = () => {
      if (businessConfig) {
        // Force a small delay to ensure theme system is initialized
        setTimeout(() => {
          setTheme({ images: { hero: businessConfig.hero.backgroundImage } });
        }, 50);
      } else {
        // If not loaded yet, check again
        setTimeout(checkTheme, 100);
      }
    };
    
    checkTheme();
  }, [businessConfig]);

  // Show loading state while waiting for config
  if (isLoading || !businessConfig) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading hero...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="text-center text-white">
          <p>Error loading hero: {error}</p>
        </div>
      </section>
    );
  }

  // Get hero data from config
  const { hero } = businessConfig;
  
  // Safety check - ensure hero data exists
  if (!hero) {
    return (
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="text-center text-white">
          <p>Error: Hero configuration not found</p>
        </div>
      </section>
    );
  }
  
  // Debug logging
  console.log('Hero component - Hero config:', hero);
  console.log('Hero component - Background image:', hero.backgroundImage);
  
  return (
    <section className="relative h-screen min-h-[600px] flex items-end justify-center overflow-hidden">
      {/* Header Overlay */}
      <Header />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat hero-background bg-cover"
        data-theme="unified"
        style={{ 
          backgroundImage: `url(${hero.backgroundImage})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 pb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {hero.headline}
        </h1>
        {hero.subheadline && (
          <p className="text-lg md:text-xl uppercase tracking-widest mb-8 text-gray-200 font-medium">
            {hero.subheadline}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onBookNow}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {hero.ctaText}
          </button>
          <button
            onClick={onRequestQuote}
            className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {hero.secondaryCta}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;