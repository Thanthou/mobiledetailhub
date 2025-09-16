import React from 'react';

interface CarouselIndicatorsProps {
  totalItems: number;
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  totalItems,
  currentIndex,
  onIndicatorClick
}) => {
  if (totalItems <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalItems }, (_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={`w-3 h-3 rounded-full transition-colors ${
            index === currentIndex 
              ? 'bg-orange-500' 
              : 'bg-stone-600 hover:bg-stone-500'
          }`}
          aria-label={`Go to service ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
