import React from 'react';

import CTA from './CTA';
import TextDisplay from './TextDisplay';

interface ContentContainerProps {
  title: string;
  subtitle: string;
  onRequestQuote?: () => void;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ 
  title, 
  subtitle,
  onRequestQuote,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-end h-full ${className}`}>
      <TextDisplay 
        title={title} 
        subtitle={subtitle}
        className="mb-0 sm:mb-8" 
      />
      <CTA onRequestQuote={onRequestQuote} />
      {/* ReviewsSummary removed - main-app doesn't have reviews yet */}
    </div>
  );
};

export default ContentContainer;
