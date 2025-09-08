import React from 'react';
import { GetStarted } from 'shared';

import type { MDHConfigContextType } from '@/contexts/useMDHConfig';
import { useMDHConfig } from '@/contexts/useMDHConfig';

import FooterBottom from '../FooterBottom';
import FooterGrid from './Grid';

// Type definitions
interface MDHConfig {
  header_display?: string;
  [key: string]: unknown;
}

interface MDHWindow extends Window {
  __MDH__?: MDHConfig;
}

const MDHFooter: React.FC = () => {
  const mdhConfigContext = useMDHConfig() as MDHConfigContextType | undefined;
  const mdhConfig = mdhConfigContext?.mdhConfig;

  // Get static config immediately (available from mdh-config.js)
  const staticConfig = typeof window !== 'undefined' ? (window as MDHWindow).__MDH__ : null;
  
  // Use dynamic config if available, otherwise fall back to static config
  const config = mdhConfig || staticConfig;
  
  // Always render footer immediately - never wait for network
  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <FooterGrid parentConfig={config} />
        
        {/* Get Started Section - Centered Below Columns */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-6 text-orange-400">
            Ready to Get Started?
          </h3>
          <div className="max-w-md mx-auto">
            <GetStarted
              placeholder="Enter your zip code or city"
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