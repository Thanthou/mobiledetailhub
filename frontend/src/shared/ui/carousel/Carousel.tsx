import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface CarouselProps<T extends CarouselItem> {
  items: T[];
  selectedItem?: string;
  onItemSelect: (itemId: string) => void;
  renderItem: (item: T & { position: 'center' | 'left' | 'right' }, isSelected: boolean) => React.ReactNode;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  containerHeight?: string;
  containerTop?: string;
}

const Carousel = <T extends CarouselItem>({
  items,
  selectedItem,
  onItemSelect,
  renderItem,
  onItemClick,
  emptyMessage = "No items available",
  containerHeight = "h-[70vh]",
  containerTop = "top-[36.5%]"
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  

  // Update index when items load to show most popular item in center
  useEffect(() => {
    if (items.length > 0) {
      const popularIndex = items.findIndex(item => item.popular);
      const initialIndex = popularIndex !== -1 ? popularIndex : 0;
      setCurrentIndex(initialIndex);
    }
  }, [items]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const getVisibleItems = () => {
    const visible: (T & { position: 'center' | 'left' | 'right' })[] = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + items.length) % items.length;
      const item = items[index];
      if (item) {
        visible.push({
          ...item,
          popular: item.popular || false, // Ensure boolean type
          position: i === 0 ? 'center' : i === -1 ? 'left' : 'right'
        });
      }
    }
    return visible;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-5xl mx-auto ${containerHeight}`}>
      {/* Items Container */}
      <div className={`absolute ${containerTop} left-1/2 transform -translate-x-1/2 w-full`}>
        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute -left-8 sm:-left-16 md:-left-32 lg:-left-64 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute -right-8 sm:-right-16 md:-right-32 lg:-right-64 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg"
              aria-label="Next item"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        
        <div className="flex items-center justify-center gap-4 w-full max-w-5xl">
          {getVisibleItems().map((item) => {
            const isSelected = selectedItem === item.id;
            return (
              <div key={item.id} onClick={() => onItemClick?.(item)}>
                {renderItem(item, isSelected)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
