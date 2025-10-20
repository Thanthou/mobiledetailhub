/**
 * Demo component showing deep merge functionality
 * Useful for development and testing merge behavior
 * 
 * NOTE: Temporarily disabled - needs refactoring for modular data structure
 * mobile-detailing no longer uses site.json, uses assets.json + content-defaults.json instead
 */

import React from 'react';

// import { useState } from 'react';

// import bullheadCityData from '@/data/locations/az/bullhead-city.json';
// import lasVegasData from '@/data/locations/nv/las-vegas.json';
// import { useMergedLocationDataDebug } from '@shared/hooks/useMergedLocationData';
// import type { LocationPage } from '@shared/types/location';

// Commented-out code below references these - uncomment if re-enabling
// import { ValidationStatus } from '@shared/ui';

interface MergeDemoProps {
  className?: string;
}

// Type the imported JSON data
// const typedBullheadData = bullheadCityData as LocationPage;
// const typedLasVegasData = lasVegasData as LocationPage;

export const MergeDemo: React.FC<MergeDemoProps> = ({ className = '' }) => {
  // Disabled - needs refactoring for modular data
  return (
    <div className={`p-6 bg-gray-900 text-white ${className}`}>
      <h2 className="text-2xl font-bold mb-4">MergeDemo Component (Deprecated)</h2>
      <p className="text-gray-400">
        This component is disabled and needs refactoring for the new modular data structure.
      </p>
      <p className="text-gray-400 mt-2">
        mobile-detailing now uses: assets.json, content-defaults.json, seo-defaults.json instead of site.json
      </p>
    </div>
  );
};

// Original implementation deleted - referenced location files that no longer exist

export default MergeDemo;
