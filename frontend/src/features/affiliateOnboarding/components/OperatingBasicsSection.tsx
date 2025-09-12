import React from 'react';
import { Building } from 'lucide-react';

import type { AffiliateApplication } from '../types';
import { CATEGORIES } from '../types';

interface OperatingBasicsSectionProps {
  formData: AffiliateApplication;
  handleArrayChange: (field: string, value: string, checked: boolean) => void;
}

const OperatingBasicsSection: React.FC<OperatingBasicsSectionProps> = ({
  formData,
  handleArrayChange
}) => {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-lg">
      <div className="p-6 border-b border-stone-700">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <Building className="w-5 h-5 mr-2 text-orange-400" />
          Operating Basics
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Services you offer
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="block text-gray-300 text-sm font-medium mb-4">
            Service Categories <span className="text-red-400">*</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <label key={category} htmlFor={`category-${category}`} className="flex items-start space-x-3">
                <input
                  id={`category-${category}`}
                  name={`category-${category}`}
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={(e) => { handleArrayChange('categories', category, e.target.checked); }}
                  className="mt-1 border-stone-600 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-300">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatingBasicsSection;
