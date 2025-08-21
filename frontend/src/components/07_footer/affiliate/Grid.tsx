import React from 'react';
import QuickLinksColumn from '../columns/QuickLinksColumn';
import SocialMediaColumn from '../columns/SocialMediaColumn';
import CTAButtonsContainer from '../../Book_Quote/CTAButtonsContainer';

interface FooterGridProps {
  parentConfig: any;
  businessSlug?: string;
  onRequestQuote: () => void;
}

const FooterGrid: React.FC<FooterGridProps> = ({ parentConfig, onRequestQuote }) => {
  const handleBookNow = () => {
    // TODO: Implement booking functionality
    console.log('Book Now clicked');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-12 ml-52">
      <QuickLinksColumn />
      <SocialMediaColumn
        socialMedia={{
          facebook: parentConfig?.facebook,
          instagram: parentConfig?.instagram,
          tiktok: parentConfig?.tiktok,
          youtube: parentConfig?.youtube,
        }}
      />
      <div className="flex flex-col items-center md:items-start justify-start">
        <h3 className="font-bold text-orange-400 text-xl mb-6">Get Started</h3>
        <CTAButtonsContainer 
          className="w-full" 
          variant="stacked"
          onBookNow={handleBookNow}
          onRequestQuote={onRequestQuote}
        />
      </div>
    </div>
  );
};

export default FooterGrid;