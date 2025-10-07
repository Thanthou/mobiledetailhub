import React from 'react';
import { Car, Settings, Shield, CreditCard, MapPin } from 'lucide-react';

import { FilterChip } from '@/shared/ui';

interface FAQCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  All: Car,
  General: Car,
  Services: Car,
  Scheduling: Settings,
  Pricing: CreditCard,
  Preparation: Shield,
  RV: Car,
  Locations: MapPin,
  Payments: CreditCard,
  Warranty: Shield,
  Aftercare: Shield,
};

const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  categories
}) => {
  // Split into two rows: 5 in first row, remaining in second row
  const firstRow = categories.slice(0, 5);
  const secondRow = categories.slice(5);
  
  const renderChip = (categoryName: string) => {
    // No mapping needed - use category names directly from database
    const isSelected = selectedCategory === categoryName;
    // Get appropriate icon for this category
    const IconComponent = categoryIcons[categoryName] || MapPin;
    
    return (
      <FilterChip
        key={categoryName}
        onClick={() => onCategoryChange(categoryName)}
        isSelected={isSelected}
        icon={IconComponent}
        className="transform hover:scale-105 backdrop-blur-sm"
      >
        {categoryName}
      </FilterChip>
    );
  };
  
  return (
    <div className="flex flex-col items-center gap-3">
      {/* First row - 5 chips */}
      <div className="flex justify-center gap-3">
        {firstRow.map(renderChip)}
      </div>
      
      {/* Second row - 4 chips */}
      <div className="flex justify-center gap-3">
        {secondRow.map(renderChip)}
      </div>
    </div>
  );
};

export default FAQCategoryFilter;
