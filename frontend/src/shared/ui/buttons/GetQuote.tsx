import React from 'react';

import { Button } from './Button';
import { cn } from '@/shared/utils/cn';

interface GetQuoteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const GetQuote = React.forwardRef<HTMLButtonElement, GetQuoteProps>(
  ({
    variant = 'secondary',
    size = 'lg',
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...props
  }, ref) => {
    const buttonText = children || 'Request Quote';

    return (
      <Button
        variant={variant}
        size={size}
        loading={loading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        className={cn(
          'px-12 py-5 text-xl h-16 whitespace-nowrap',
          className
        )}
        ref={ref}
        {...props}
      >
        {buttonText}
      </Button>
    );
  }
);

GetQuote.displayName = 'GetQuote';

export default GetQuote;
