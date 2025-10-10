/**
 * Preview Banner
 * 
 * Sticky banner at the top of preview pages indicating this is a demo.
 * Includes CTA to "Get this site" (conversion flow - to be implemented later).
 */

import React from 'react';
import { Eye } from 'lucide-react';

interface PreviewBannerProps {
  businessName: string;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({ businessName }) => {
  const handleGetThisSite = () => {
    // TODO: Wire to onboarding flow in later phase
    alert('Conversion to tenant onboarding will be implemented in the next phase!');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="h-5 w-5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Preview Mode</span>
            <span className="text-xs opacity-90">
              This is how your site for {businessName} would look
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetThisSite}
          className="bg-white text-orange-600 px-6 py-2 rounded-md font-semibold hover:bg-orange-50 transition-colors shadow-md text-sm md:text-base"
        >
          Get This Site
        </button>
      </div>
    </div>
  );
};

