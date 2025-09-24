import React from 'react';
import { Car, Settings, Shield, CreditCard, MapPin } from 'lucide-react';

import { FilterChip } from '@/shared/ui';

interface FAQCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
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
  onCategoryChange,
  categories
}) => {
  // Split into two rows: 5 in first row, remaining in second row
  const firstRow = categories.slice(0, 5);
  const secondRow = categories.slice(5);
  
  const renderChip = (categoryName: string) => {
    // For categories not in mapping (like location-specific ones), use the category name as-is
    const actualCategory = categoryMapping[categoryName as keyof typeof categoryMapping] || categoryName;
    // Use MapPin icon for location categories (city names or 'Location')
    const IconComponent = (categoryName !== 'All' && categoryName !== 'General' && categoryName !== 'Services' && categoryName !== 'Scheduling' && categoryName !== 'Pricing' && categoryName !== 'Preparation' && categoryName !== 'RV' && categoryName !== 'Locations' && categoryName !== 'Payments' && categoryName !== 'Warranty') ? MapPin : (categoryIcons[categoryName as keyof typeof categoryIcons] || Car);
    const isSelected = selectedCategory === actualCategory;
    
    return (
      <FilterChip
        key={categoryName}
        onClick={() => onCategoryChange(actualCategory)}
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
