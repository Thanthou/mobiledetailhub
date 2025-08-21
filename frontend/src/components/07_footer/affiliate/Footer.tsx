import React, { useEffect, useState } from 'react';
import FooterGrid from './Grid';
import FooterBottom from '../FooterBottom';
import FooterLoadingState from '../FooterLoadingState';
import FooterErrorState from '../FooterErrorState';

type MDHConfig = {
  name?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  // add other fields as needed
};

interface AffiliateFooterProps {
  onRequestQuote: () => void;
}

const AffiliateFooter: React.FC<AffiliateFooterProps> = ({ onRequestQuote }) => {
  const [config, setConfig] = useState<MDHConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    fetch('/api/mdh-config')
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
        <FooterGrid parentConfig={config} onRequestQuote={onRequestQuote} />
        <FooterBottom businessInfo={{ name: config.name || 'Your Business' }} />
      </div>
    </footer>
  );
};

export default AffiliateFooter;