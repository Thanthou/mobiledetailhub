import React from 'react';
import MDHHeroContent from './MDHHeroContent';
import BusinessHeroContent from './BusinessHeroContent';
import { HERO_CONSTANTS } from './constants';

interface HeroContentProps {
  businessConfig: any;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({ 
  businessConfig, 
  onBookNow, 
  onRequestQuote 
}) => {
  const isMDH = businessConfig.slug === HERO_CONSTANTS.BUSINESS_TYPES.MDH;

  return (
    <div className="relative z-10 text-center text-white px-4 pb-16 max-w-4xl mx-auto">
      {isMDH ? (
        <MDHHeroContent onBookNow={onBookNow} />
      ) : (
        <BusinessHeroContent 
          onBookNow={onBookNow} 
          onRequestQuote={onRequestQuote} 
        />
      )}
    </div>
  );
};

export default HeroContent;