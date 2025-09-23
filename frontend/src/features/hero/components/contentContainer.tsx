import React from 'react';
import TextDisplay from './TextDisplay';
import CTA from './CTA';

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
    </div>
  );
};

export default ContentContainer;
