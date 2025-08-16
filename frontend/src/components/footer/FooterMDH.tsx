import React from 'react';
import { useBusinessConfig } from '../../hooks/useBusinessConfig';
import FooterGrid from './FooterGrid';
import GetStartedSection from './GetStartedSection';
import FooterBottom from './FooterBottom';
import FooterLoadingState from './FooterLoadingState';
import FooterErrorState from './FooterErrorState';

interface FooterProps {
  businessSlug?: string;
}

const FooterMDH: React.FC<FooterProps> = ({ businessSlug }) => {
  const { businessConfig, parentConfig, isLoading, error, getBusinessInfoWithOverrides } = useBusinessConfig();
  
  if (isLoading) {
    return <FooterLoadingState />;
  }

  if (error || !businessConfig || !getBusinessInfoWithOverrides) {
    return <FooterErrorState />;
  }

  const businessInfo = getBusinessInfoWithOverrides;

  return (
    <footer className="bg-stone-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Content Grid */}
        <FooterGrid 
          parentConfig={parentConfig}
          businessSlug={businessSlug}
        />

        {/* Get Started Section */}
        <GetStartedSection />

        {/* Bottom Section */}
        <FooterBottom businessInfo={businessInfo} />
      </div>
    </footer>
  );
};

export default FooterMDH;