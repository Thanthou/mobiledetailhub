import React from 'react';
import GetStarted from 'shared/LocationSearchBar';

const GetStartedSection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <h3 className="text-2xl font-bold mb-6 text-orange-400 text-center">
        Ready to Get Started?
      </h3>
      <GetStarted
        placeholder="Enter your zip code or city"
        className="w-full"
      />
    </div>
  );
};

export default GetStartedSection;