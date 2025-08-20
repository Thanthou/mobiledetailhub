import React from 'react';
import CTAButtonsContainer from '../../shared/CTAButtonsContainer';

interface AffiliateFooterProps {
  onRequestQuote?: () => void;
  onBookNow?: () => void;
}

const AffiliateFooter: React.FC<AffiliateFooterProps> = ({ 
  onRequestQuote, 
  onBookNow 
}) => {
  return (
    <div className="text-center py-8">
      <div className="space-y-4">
        <CTAButtonsContainer 
          onBookNow={onBookNow}
          onRequestQuote={onRequestQuote}
          direction="row"
          className="gap-4 justify-center items-center max-w-md mx-auto"
        />
      </div>
    </div>
  );
};

export default AffiliateFooter;