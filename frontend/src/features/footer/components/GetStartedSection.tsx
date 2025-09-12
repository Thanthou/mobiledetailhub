import React from 'react';

import { LocationSearchBar as GetStarted } from '@/shared/ui';

const GetStartedSection: React.FC = () => {
  const handleLocationSubmit = () => {
    // Handle location submission for footer - same as hero
    // The LocationSearchBar will handle the routing logic
  };

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">
        Ready to Get Started?
      </h3>
      <GetStarted
        onLocationSubmit={handleLocationSubmit}
        placeholder="Enter your zip code or city to find services near you"
        className="w-full"
        id="location-search-footer"
      />
    </div>
  );
};

export default GetStartedSection;
