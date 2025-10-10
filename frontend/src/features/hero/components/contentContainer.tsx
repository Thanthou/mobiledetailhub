import React from 'react';

import { ReviewsSummary } from '@/shared/ui';

import CTA from './CTA';
import TextDisplay from './TextDisplay';

interface ContentContainerProps {
  title: string;
  subtitle: string;
  isLocation: boolean;
  locationName: string;
  onRequestQuote?: () => void;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  title, 
  subtitle, 
  isLocation,
  locationName,
  onRequestQuote,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-end h-full pt-24 pb-20 ${className}`}>
      <TextDisplay 
        title={title} 
        subtitle={subtitle} 
        isLocation={isLocation}
        locationName={locationName}
        className="mb-8" 
      />
      <CTA onRequestQuote={onRequestQuote} />
      <ReviewsSummary 
        variant="compact" 
        className="mt-6 text-xl" 
      />
    </div>
  );
};

export default ContentContainer;
