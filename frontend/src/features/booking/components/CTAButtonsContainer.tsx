// Simple CTA buttons container for compatibility
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { useSiteContext } from '@/shared/hooks';

interface CTAButtonsContainerProps {
  onRequestQuote?: () => void;
  onQuoteHover?: () => void;
  variant?: 'side-by-side' | 'stacked';
  className?: string;
}

const CTAButtonsContainer: React.FC<CTAButtonsContainerProps> = ({
  onRequestQuote,
  onQuoteHover,
  variant = 'side-by-side',
  className = ''
  }) => {
    const navigate = useNavigate();
    const { businessSlug } = useSiteContext();

    const handleBookNow = () => {
      // Navigate to booking page, preserving business slug for affiliate sites
      const bookingPath = businessSlug ? `/${businessSlug}/booking` : '/booking';
      navigate(bookingPath);
    };
  const buttonClasses = variant === 'side-by-side' 
    ? 'flex flex-col sm:flex-row gap-4'
    : 'flex flex-col gap-4';

  return (
    <div className={`${buttonClasses} ${className}`}>
      <Button
        onClick={handleBookNow}
        variant="primary"
        size="lg"
        className="w-full sm:w-auto px-8 py-3"
      >
        Book Now
      </Button>
      
      <Button
        onClick={onRequestQuote}
        onMouseEnter={onQuoteHover}
        variant="secondary"
        size="lg"
        className="w-full sm:w-auto px-8 py-3"
      >
        Request Quote
      </Button>
    </div>
  );
};

export default CTAButtonsContainer;
