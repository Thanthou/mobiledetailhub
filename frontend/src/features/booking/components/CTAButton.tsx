// Simple CTA button component for compatibility
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import { useSiteContext } from '@/shared/hooks';

interface CTAButtonProps {
  type: 'book' | 'quote';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  className?: string;
  children?: React.ReactNode;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  type,
  onClick,
  onMouseEnter,
  onFocus,
  variant = 'primary',
  className = '',
  children
  }) => {
    const navigate = useNavigate();
    const { businessSlug } = useSiteContext();

    const handleClick = () => {
      if (type === 'book') {
        // Navigate to booking page, preserving business slug for affiliate sites
        const bookingPath = businessSlug ? `/${businessSlug}/booking` : '/booking';
        navigate(bookingPath);
      } else {
        // Use custom onClick for "Request Quote" buttons
        onClick?.();
      }
    };
  const getButtonText = () => {
    if (children) return children;
    switch (type) {
      case 'book':
        return 'Book Now';
      case 'quote':
        return 'Request Quote';
      default:
        return 'Click Me';
    }
  };

  const getVariant = () => {
    switch (variant) {
      case 'outlined':
        return 'outline';
      case 'secondary':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Button
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      variant={getVariant()}
      size="lg"
      className={`px-8 py-3 ${className}`}
    >
      {getButtonText()}
    </Button>
  );
};

export default CTAButton;
