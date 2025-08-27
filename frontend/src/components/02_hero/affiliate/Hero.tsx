import React from 'react';
import CTAButtonsContainer from '../../Book_Quote/CTAButtonsContainer';

interface BusinessHeroContentProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
  onQuoteHover?: () => void;
}

const BusinessHeroContent: React.FC<BusinessHeroContentProps> = ({ 
  onBookNow, 
  onRequestQuote,
  onQuoteHover
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight whitespace-nowrap text-center text-white">
        Premium Mobile Detailing
      </h1>
      <CTAButtonsContainer
        onBookNow={onBookNow}
        onRequestQuote={onRequestQuote}
        onQuoteHover={onQuoteHover}
        variant="side-by-side"
        className="max-w-md mx-auto [&>*]:w-48 [&>*]:justify-center"
      />
    </div>
  );
};

export default BusinessHeroContent;