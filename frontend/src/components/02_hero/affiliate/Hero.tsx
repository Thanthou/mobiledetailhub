import React from 'react';
import CTAButtonsContainer from '../../Book_Quote/CTAButtonsContainer';

interface BusinessHeroContentProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const BusinessHeroContent: React.FC<BusinessHeroContentProps> = ({ 
  onBookNow, 
  onRequestQuote 
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight whitespace-nowrap text-center text-white">
        Premium Mobile Detailing
      </h1>
      <CTAButtonsContainer
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
        variant="side-by-side"
        className="justify-center items-center"
      />
    </div>
  );
};

export default BusinessHeroContent;