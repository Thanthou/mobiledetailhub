import React from 'react';

import type { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {

  return (
    <div className="p-4">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => { onCategoryChange(category.id); }}
            className={`w-full flex items-center space-x-3 p-3 mb-2 rounded-lg text-left transition-colors ${
              isSelected 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-stone-700 hover:text-white'
            }`}
          >
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};