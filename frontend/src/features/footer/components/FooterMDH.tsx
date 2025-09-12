import React from 'react';

import { useMDHConfig } from '@/shared/hooks';
import { LocationSearchBar as GetStarted } from '@/shared/ui';

import FooterBottom from './FooterBottom';
import FooterGrid from './FooterGrid';

// Type definitions
interface MDHConfig {
  header_display?: string;
  [key: string]: unknown;
}

interface MDHWindow extends Window {
  __MDH__?: MDHConfig;
}

const MDHFooter: React.FC = () => {
  const mdhConfigContext = useMDHConfig();
  const mdhConfig = mdhConfigContext.mdhConfig;

  // Get static config immediately (available from TypeScript data file)
  const staticConfig = typeof window !== 'undefined' ? (window as MDHWindow).__MDH__ : null;
  
  // Use dynamic config if available, otherwise fall back to static config
  const config = mdhConfig || staticConfig || {};
  
  // Always render footer immediately - never wait for network
  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <FooterGrid 
          parentConfig={config} 
          serviceAreas={[]} 
          onRequestQuote={() => {}} 
          onBookNow={() => {}} 
          onQuoteHover={() => {}}
          isMDH={true}
        />
        
        {/* Get Started Section - Centered Below Columns */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-6 text-orange-400">
            Ready to Get Started?
          </h3>
          <div className="max-w-xl mx-auto">
            <GetStarted
              onLocationSubmit={() => {
                // Handle location submission for footer - same as hero
                // The LocationSearchBar will handle the routing logic
              }}
              placeholder="Enter your zip code or city to find services near you"
              className="w-full"
              id="location-search-footer-mdh"
            />
          </div>
        </div>
        
        <FooterBottom businessInfo={{ name: (config as MDHConfig).header_display || 'Mobile Detail Hub' }} />
      </div>
    </footer>
  );
};

export default MDHFooter;
