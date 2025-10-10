import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/utils/cn';

import { Button } from './Button';

interface BookNowProps {
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const BookNow = React.forwardRef<HTMLButtonElement, BookNowProps>(
  ({
    to,
    onClick,
    variant = 'primary',
    size = 'lg',
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...props
  }, ref) => {
    const buttonText = children || 'Book Now';

    // Determine destination based on context
    const getDestination = () => {
      if (to) return to; // Use custom destination if provided
      
      // Always go directly to booking for now
      // TODO: Add location selection page if needed
      return '/booking';
    };

    const buttonProps = {
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      className: cn(
        'px-12 py-5 text-xl h-16 whitespace-nowrap',
        className
      ),
      children: buttonText,
      ref,
      ...props
    };

    if (onClick) {
      return (
        <Button
          onClick={onClick}
          {...buttonProps}
        />
      );
    }

    return (
      <Link to={getDestination()}>
        <Button {...buttonProps} />
      </Link>
    );
  }
);

BookNow.displayName = 'BookNow';

export default BookNow;
