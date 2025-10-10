import React, { useState } from 'react';
import { BarChart3, ChevronDown, ChevronRight, Eye } from 'lucide-react';

interface ServiceImage {
  slug: string;
  image: string;
  alt: string;
  title: string;
}

interface ServicesSectionProps {
  serviceImages?: ServiceImage[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  serviceImages = [],
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Services</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { /* Preview functionality */ }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </button>
          <button
            onClick={() => { setIsCollapsed(!isCollapsed); }}
            className="flex items-center px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {isCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          <div>
            <div className="block text-sm font-medium text-gray-300 mb-2">
              Service Images (6 services)
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-5xl">
              {serviceImages.map((service) => (
                <div
                  key={service.slug}
                  className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                >
                  <div className="aspect-[4/3] bg-stone-700 relative">
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-gray-400 text-sm';
                        fallback.textContent = 'Image not found';
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <div className="p-4 bg-stone-800">
                    <p className="text-sm text-gray-300 font-medium text-center">
                      {service.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These 6 service images will be displayed in the services grid on your website.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

