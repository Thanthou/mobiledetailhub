import React from 'react';

import { cn } from '@/shared/utils/cn';

import { Button } from './Button';

interface GetQuoteProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
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
    style,
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
          'whitespace-nowrap',
          className
        )}
        style={style}
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
