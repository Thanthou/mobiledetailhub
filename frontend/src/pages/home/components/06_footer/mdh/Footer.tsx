import React from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterErrorState from '../FooterErrorState';
import { GetStarted } from 'shared';
import { useMDHConfig } from '/src/contexts/MDHConfigContext';

const MDHFooter: React.FC = () => {
  const { mdhConfig, isLoading } = useMDHConfig();

  // Get static config immediately (available from mdh-config.js)
  const staticConfig = typeof window !== 'undefined' ? window.__MDH__ : null;
  
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
        
        <FooterBottom businessInfo={{ name: config?.header_display || 'Mobile Detail Hub' }} />
      </div>
    </footer>
  );
};

export default MDHFooter;