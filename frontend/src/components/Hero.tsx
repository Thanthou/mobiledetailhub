import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useBusinessConfig } from '../hooks/useBusinessConfig';
import { GetStarted } from './shared';

interface HeroProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow, onRequestQuote }) => {
  const { businessConfig, isLoading, error } = useBusinessConfig();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images - defined directly in component since only this component rotates
  const heroImages = [
    '/hero/image1.png',
    '/hero/image2.png',
  ].filter(Boolean);

  // Hero image rotation - 6 second intervals
  useEffect(() => {
    if (heroImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [heroImages.length]);

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

  // Get business info from config
  const { business } = businessConfig;
  
  // Check if this is MDH (Mobile Detail Hub)
  const isMdh = businessConfig.slug === 'mdh';
  
  return (
    <section className="hero-section flex items-end justify-center">
      {/* Header Overlay */}
      <Header />
      
      {/* Hero Background Image Rotator */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((src, idx) => (
          <img
            key={`hero-${idx}`}
            src={src}
            alt={`Hero background ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: idx === currentImageIndex ? 1 : 0,
              transition: 'opacity 2000ms ease-in-out',
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 pb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          {isMdh ? 'Find Mobile Detailing Near You' : 'Professional Mobile Detailing'}
        </h1>
        
        {isMdh ? (
          // MDH: Show Get Started location input
          <div className="max-w-md mx-auto">
            <GetStarted
              onLocationSubmit={(location, zipCode, city, state) => {
                console.log('Location submitted:', { location, zipCode, city, state });
                // Handle location submission for MDH
                if (onBookNow) {
                  onBookNow();
                }
              }}
              placeholder="Enter your zip code or city"
              className="text-lg"
            />
            <p className="text-sm text-gray-200 mt-3">
              We'll connect you with professional detailers in your area
            </p>
          </div>
        ) : (
          // Other businesses: Show Book Now and Request Quote buttons
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onBookNow}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Book Now
            </button>
            <button
              onClick={onRequestQuote}
              className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Request Quote
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;