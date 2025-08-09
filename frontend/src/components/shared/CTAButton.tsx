import React from 'react';

interface CTAButtonProps {
  type: 'book' | 'quote';
  onClick?: () => void;
  className?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({ type, onClick, className = '' }) => {
  const isBookNow = type === 'book';
  
  const baseClasses = "font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex-1 max-w-xs";
  const bookClasses = "bg-orange-500 hover:bg-orange-600 text-white";
  const quoteClasses = "bg-gray-600 hover:bg-gray-700 text-white";
  
  const buttonClasses = `${baseClasses} ${isBookNow ? bookClasses : quoteClasses} ${className}`;
  
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