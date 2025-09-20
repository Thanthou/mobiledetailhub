import React from 'react';
import { Car, Settings, Shield, CreditCard } from 'lucide-react';

import { FilterChip } from '@/shared/ui';

interface FAQCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Mapping from display names to actual category names
const categoryMapping = {
  'All': 'All',
  'General': 'General',
  'Services': 'Services & Packages',
  'Scheduling': 'Scheduling & Location',
  'Pricing': 'Pricing & Payment',
  'Preparation': 'Preparation & Aftercare',
  'RV': 'RV & Boat Services',
  'Locations': 'Locations',
  'Payments': 'Payments & Deposits',
  'Warranty': 'Warranty & Guarantee',
};

const categoryIcons = {
  All: Car,
  General: Car,
  Services: Car,
  Scheduling: Settings,
  Pricing: CreditCard,
  Preparation: Shield,
  RV: Car,
  Locations: Settings,
  Payments: CreditCard,
  Warranty: Shield,
};

const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  // Create display categories from the mapping
  const displayCategories = Object.keys(categoryMapping);
  
  // Split into two rows: 5 in first row, 4 in second row
  const firstRow = displayCategories.slice(0, 5);
  const secondRow = displayCategories.slice(5);
  
  const renderChip = (displayName: string) => {
    const actualCategory = categoryMapping[displayName as keyof typeof categoryMapping];
    const IconComponent = categoryIcons[displayName as keyof typeof categoryIcons] || Car;
    const isSelected = selectedCategory === actualCategory;
    
    return (
      <FilterChip
        key={displayName}
        onClick={() => onCategoryChange(actualCategory)}
        isSelected={isSelected}
        icon={IconComponent}
        className="transform hover:scale-105 backdrop-blur-sm"
      >
        {displayName}
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
