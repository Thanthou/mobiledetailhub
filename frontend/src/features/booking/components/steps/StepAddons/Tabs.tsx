import React from 'react';
import { Wrench, Droplets, Sparkles, Shield, Zap, Plus } from 'lucide-react';

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
    <div className="mb-8 absolute top-[18%] left-1/2 transform -translate-x-1/2 w-full z-10">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {addonCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => {
                console.log('🔍 Tab button clicked:', category.id);
                onCategorySelect(category.id);
              }}
              className={`p-2 rounded-lg border-2 transition-all w-24 h-24 pointer-events-auto z-20 ${
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
  );
};

export default Tabs;
