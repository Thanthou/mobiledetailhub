import React from 'react';

interface CTAButtonProps {
  type: 'book' | 'quote';
  onClick?: () => void;
  className?: string;
  variant?: 'filled' | 'outlined';
}

const CTAButton: React.FC<CTAButtonProps> = ({ type, onClick, className = '', variant }) => {
  const isBookNow = type === 'book';
  // Default to outlined for quote, filled for book
  const isOutlined = variant === 'outlined' || (!isBookNow && !variant);

  const baseClasses = "font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg max-w-xs whitespace-nowrap";
  const bookClasses = "bg-orange-500 hover:bg-orange-600 text-white";
  const quoteFilled = "bg-gray-600 hover:bg-gray-700 text-white";
  const quoteOutlined = "bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white";

  const buttonClasses = `${baseClasses} ${isBookNow ? bookClasses : isOutlined ? quoteOutlined : quoteFilled} ${className}`;

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
    >
      {isBookNow ? 'Book Now' : 'Request a Quote'}
    </button>
  );
};

export default CTAButton; 