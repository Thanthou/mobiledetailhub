import React from 'react';
import { Droplets, Shield, Sparkles, Wrench } from 'lucide-react';

interface TabsProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedCategory, onCategorySelect }) => {
  // Addon categories
  const addonCategories = [
    { id: 'windows', name: 'Windows', icon: Sparkles },
    { id: 'wheels', name: 'Wheels', icon: Wrench },
    { id: 'trim', name: 'Interior', icon: Droplets },
    { id: 'engine', name: 'Engine', icon: Shield },
  ];

  return (
    <div className="absolute left-0 right-0 z-20 py-8" style={{ top: '150px' }}>
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {addonCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  onCategorySelect(category.id);
                }}
                className={`p-2 rounded-lg border-2 transition-all w-24 h-24 ${
                  selectedCategory === category.id
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <IconComponent className="w-8 h-8 text-white mb-2 mx-auto" />
                <div className="text-white font-medium">{category.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
