import React from 'react';

import { useDataOptional } from '@shared/hooks/useData';
import { cn } from '@shared/utils/cn';

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
  const data = useDataOptional();
  const isPreview = data?.isPreview || false;

  // Default both to the same size unless overridden
  const buttonSize = bookNowProps.size ?? getQuoteProps.size ?? 'lg';

  const containerClasses =
    layout === 'vertical'
      ? // Single column, centered, consistent width
        'flex flex-col gap-3 w-full max-w-[28rem] md:max-w-[32rem] mx-auto px-6'
      : // 1 col on mobile, 2 equal cols ≥ sm
        'grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[28rem] md:max-w-[32rem] mx-auto px-6';

  const commonBtnClasses = 'w-full justify-center'; // fill column, equal widths

  const handleBookNowClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();
      alert('📋 Preview Mode\n\nBooking is disabled in preview mode.\n\nThis is a demonstration site to showcase features to potential clients.');
      return;
    }
    bookNowProps.onClick?.();
  };

  return (
    <div className={cn(containerClasses, className)}>
      <BookNow
        variant={bookNowProps.variant ?? 'primary'}
        size={buttonSize}
        className={cn(commonBtnClasses, isPreview && 'cursor-pointer', bookNowProps.className)}
        onClick={isPreview ? handleBookNowClick : bookNowProps.onClick}
        {...(bookNowProps.to && !isPreview && { to: bookNowProps.to })}
      >
        {bookNowProps.children ?? 'Book Now'}
      </BookNow>

      <GetQuote
        variant={getQuoteProps.variant ?? 'outline-white'}
        size={buttonSize}
        className={cn(commonBtnClasses, getQuoteProps.className)}
        onClick={getQuoteProps.onClick}
      >
        {getQuoteProps.children ?? 'Request Quote'}
      </GetQuote>
    </div>
  );
};

export default CTAButtons;