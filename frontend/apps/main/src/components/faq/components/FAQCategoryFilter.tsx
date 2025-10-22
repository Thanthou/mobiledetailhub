import React from 'react';
import { Car, CreditCard, MapPin,Settings, Shield } from 'lucide-react';

import { FilterChip } from '@shared/ui';

interface FAQCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
  const renderChip = (categoryName: string) => {
    const isSelected = selectedCategory === categoryName;
    const IconComponent = categoryIcons[categoryName] || MapPin;
    
    return (
      <FilterChip
        key={categoryName}
        onClick={() => {
          onCategoryChange(categoryName);
        }}
        isSelected={isSelected}
        icon={IconComponent}
        className="transform hover:scale-105 backdrop-blur-sm text-sm md:text-base"
      >
        {categoryName}
      </FilterChip>
    );
  };
  
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto">
      {categories.map(renderChip)}
    </div>
  );
};

export default FAQCategoryFilter;
