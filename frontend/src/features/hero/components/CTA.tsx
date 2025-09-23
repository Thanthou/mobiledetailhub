import React from 'react';
import { CTAButtons } from '@/shared/ui';

interface CTAProps {
  className?: string;
  onRequestQuote?: () => void;
}

const CTA: React.FC<CTAProps> = ({ 
  className = "",
  onRequestQuote 
}) => {
  return (
    <CTAButtons 
      className={className}
      getQuoteProps={{
        onClick: onRequestQuote
      }}
    />
  );
};

export default CTA;
