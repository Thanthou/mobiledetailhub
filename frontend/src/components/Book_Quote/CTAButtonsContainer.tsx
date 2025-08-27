import React from 'react';
import CTAButton from './CTAButton';

interface CTAButtonsContainerProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
  onQuoteHover?: () => void;
  className?: string;
  variant?: 'stacked' | 'side-by-side';
}

const CTAButtonsContainer: React.FC<CTAButtonsContainerProps> = ({
  onBookNow,
  onRequestQuote,
  onQuoteHover,
  className = '',
  variant = 'side-by-side'
}) => {
  const containerClasses = variant === 'stacked' 
    ? 'flex flex-col space-y-4' 
    : 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      {onBookNow && (
        <CTAButton 
          type="book" 
          onClick={onBookNow}
          className="w-full sm:w-auto"
        />
      )}
      {onRequestQuote && (
        <CTAButton 
          type="quote" 
          onClick={onRequestQuote}
          onMouseEnter={onQuoteHover}
          onFocus={onQuoteHover}
          variant="outlined"
          className="w-full sm:w-auto"
        />
      )}
    </div>
  );
};

export default CTAButtonsContainer;
