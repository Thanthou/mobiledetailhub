import React from 'react';

import { Button } from '@/shared/ui';

interface CTAButtonProps {
  type: 'book' | 'quote';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  className?: string;
  variant?: 'filled' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  type, 
  onClick, 
  onMouseEnter, 
  onFocus, 
  className = '', 
  variant,
  loading = false,
  disabled = false
}) => {
  const isBookNow = type === 'book';
  // Default to outlined for quote, filled for book
  const isOutlined = variant === 'outlined' || (!isBookNow && !variant);

  // Map CTAButton variants to shared Button variants
  const getButtonVariant = () => {
    if (isBookNow) return 'primary';
    if (isOutlined) return 'outline-white';
    return 'secondary';
  };

  // Custom styling for CTA buttons
  const ctaClasses = "font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg max-w-xs whitespace-nowrap";

  return (
    <Button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      variant={getButtonVariant()}
      size="xl"
      loading={loading}
      disabled={disabled}
      className={`${ctaClasses} ${className}`}
    >
      {isBookNow ? 'Book Now' : 'Request a Quote'}
    </Button>
  );
};

export default CTAButton;
