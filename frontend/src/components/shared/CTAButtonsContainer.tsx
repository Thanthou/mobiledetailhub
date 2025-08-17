import React from 'react';
import CTAButton from './CTAButton';

interface CTAButtonsContainerProps {
  onBookNow?: () => void;
  onRequestQuote?: () => void;
  className?: string;
  direction?: 'row' | 'col'; // new prop
}

const CTAButtonsContainer: React.FC<CTAButtonsContainerProps> = ({ 
  onBookNow, 
  onRequestQuote, 
  className = '',
  direction = 'col', // default vertical
}) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className={`flex flex-${direction} gap-4 justify-center`}>
        <CTAButton 
          type="book" 
          onClick={onBookNow}
        />
        <CTAButton 
          type="quote" 
          onClick={onRequestQuote} 
        />
      </div>
    </div>
  );
};

export default CTAButtonsContainer; 