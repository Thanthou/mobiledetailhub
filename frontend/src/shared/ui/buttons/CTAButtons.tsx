import React from 'react';

import { useDataOptional } from '@/shared/contexts/DataContext';
import { cn } from '@/shared/utils/cn';

import BookNow from './BookNow';
import GetQuote from './GetQuote';

interface CTAButtonsProps {
  layout?: 'horizontal' | 'vertical';
  className?: string;
  bookNowProps?: {
    to?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    children?: React.ReactNode;
  };
  getQuoteProps?: {
    variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  };
}

const CTAButtons: React.FC<CTAButtonsProps> = ({
  layout = 'horizontal',
  className = '',
  bookNowProps = {},
  getQuoteProps = {}
}) => {
  // Check if in preview mode
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;
  
  // In preview mode, disable Book Now
  const handleBookNowClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      // Do nothing - button is disabled in preview
      return;
    }
    if (bookNowProps.onClick) {
      bookNowProps.onClick();
    }
  };
  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col space-y-4' 
    : 'flex flex-col sm:flex-row gap-4 justify-center';

  return (
    <div className={cn(containerClasses, className)}>
      <BookNow 
        variant="primary"
        className={cn(
          'w-full sm:w-auto',
          isPreview && 'opacity-50 cursor-not-allowed'
        )}
        {...bookNowProps}
        onClick={isPreview ? handleBookNowClick : bookNowProps.onClick}
        to={isPreview ? undefined : bookNowProps.to}
      />
      <GetQuote 
        variant="outline-white"
        className="w-full sm:w-auto"
        {...getQuoteProps}
      />
    </div>
  );
};

export default CTAButtons;
