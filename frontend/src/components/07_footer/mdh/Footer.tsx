import React, { useEffect, useState } from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterLoadingState from '../FooterLoadingState';
import FooterErrorState from '../FooterErrorState';
import { GetStarted } from '../../shared';
import { config as envConfig } from '../../../config/environment';

type MDHConfig = {
  name?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  // add other fields as needed
};

const MDHFooter: React.FC = () => {
  const [config, setConfig] = useState<MDHConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    fetch(`${envConfig.apiUrl}/api/mdh-config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <FooterLoadingState />;
  if (error || !config) return <FooterErrorState />;

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
            />
          </div>
        </div>
        
        <FooterBottom businessInfo={{ name: config.name || 'Your Business' }} />
      </div>
    </footer>
  );
};

export default MDHFooter;