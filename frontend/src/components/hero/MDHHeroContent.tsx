import React from 'react';
import { GetStarted } from '../shared';

interface MDHHeroContentProps {
  onBookNow?: () => void;
}

const MDHHeroContent: React.FC<MDHHeroContentProps> = ({ onBookNow }) => {
  const handleLocationSubmit = (_location?: string, _zipCode?: string, _city?: string, _state?: string) => {
    // Handle location submission for MDH
    if (onBookNow) {
      onBookNow();
    }
  };

  return (
    <>
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        Find Mobile Detailing Near You
      </h1>
      
      <div className="max-w-md mx-auto">
        <GetStarted
          onLocationSubmit={handleLocationSubmit}
          placeholder="Enter your zip code or city"
          className="text-lg"
        />
        <p className="text-sm text-gray-200 mt-3">
          We'll connect you with professional detailers in your area
        </p>
      </div>
    </>
  );
};

export default MDHHeroContent;