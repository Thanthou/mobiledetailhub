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

// eslint-disable-next-line react-refresh/only-export-components -- Default export required for component
export default CTA;
