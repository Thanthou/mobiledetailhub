import React from 'react';

interface BusinessHeroContentProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const BusinessHeroContent: React.FC<BusinessHeroContentProps> = ({ 
  onBookNow, 
  onRequestQuote 
}) => {
  return (
    <>
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        Professional Mobile Detailing
      </h1>
      
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
    </>
  );
};

export default BusinessHeroContent;