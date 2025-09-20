import React from 'react';
import BookNow from './BookNow';
import GetQuote from './GetQuote';
import { cn } from '@/shared/utils/cn';

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
  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col space-y-4' 
    : 'flex flex-col sm:flex-row gap-4 justify-center';

  return (
    <div className={cn(containerClasses, className)}>
      <BookNow 
        variant="primary"
        className="w-full sm:w-auto"
        {...bookNowProps}
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
