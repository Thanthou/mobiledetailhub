import React from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterLoadingState from '../FooterLoadingState';
import FooterErrorState from '../FooterErrorState';
import { GetStarted } from 'shared';
import { useMDHConfig } from '../../../contexts/MDHConfigContext';

const MDHFooter: React.FC = () => {
  const { mdhConfig, isLoading, error } = useMDHConfig();

  if (isLoading) return <FooterLoadingState />;
  if (error || !mdhConfig) return <FooterErrorState />;

  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <FooterGrid parentConfig={mdhConfig} />
        
        {/* Get Started Section - Centered Below Columns */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-6 text-orange-400">
            Ready to Get Started?
          </h3>
          <div className="max-w-md mx-auto">
            <GetStarted
              placeholder="Enter your zip code or city"
              className="w-full"
            />
          </div>
        </div>
        
        <FooterBottom businessInfo={{ name: mdhConfig.header_display || 'Mobile Detail Hub' }} />
      </div>
    </footer>
  );
};

export default MDHFooter;