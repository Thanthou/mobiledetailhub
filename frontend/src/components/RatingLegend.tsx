// src/components/RatingLegend.tsx
import React from 'react';

interface RatingLegendProps {
  className?: string;
}

export const RatingLegend: React.FC<RatingLegendProps> = ({ className = '' }) => {
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <span className="sr-only">Rating scale: </span>
      1-5 scale
    </div>
  );
};
