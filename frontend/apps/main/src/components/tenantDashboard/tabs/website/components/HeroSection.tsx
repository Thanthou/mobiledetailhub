import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Eye, FileText, Image } from 'lucide-react';

import { WebsiteAutoSaveField } from './WebsiteAutoSaveField';

interface HeroSectionProps {
  heroImages?: string[];
  onUpdateContent: (field: string, value: unknown) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImages = [],
  onUpdateContent,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'images'>('content');

  const availableImages = [
    { url: '/images/hero/hero1.png', alt: 'Professional mobile detailing service in action' },
    { url: '/images/hero/hero2.png', alt: 'High-quality car detailing and ceramic coating' }
  ];

  const handleImageSelect = (imageUrl: string, isSelected: boolean) => {
    let newImages;
    if (isSelected) {
      newImages = heroImages.filter(img => img !== imageUrl);
    } else {
      if (heroImages.length < 2) {
        newImages = [...heroImages, imageUrl];
      } else {
        newImages = [imageUrl, heroImages[1]];
      }
    }
    onUpdateContent('images', newImages);
  };

  return (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image className="h-5 w-5 text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Hero</h3>
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
          {/* Hero Sub-tabs */}
          <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => { setActiveTab('content'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              Content
            </button>
            <button
              onClick={() => { setActiveTab('images'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'images'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Image className="h-4 w-4 mr-2" />
              Images
            </button>
          </div>

          {/* Hero Sub-tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="w-2/5">
                  <WebsiteAutoSaveField
                    field="hero_title"
                    label="Hero Title"
                    placeholder="Enter hero title"
                  />
                </div>
                <div className="w-2/5">
                  <WebsiteAutoSaveField
                    field="hero_subtitle"
                    label="Hero Subtitle"
                    placeholder="Enter hero subtitle"
                  />
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-300 mb-2">
                    Hero Images (Select up to 2 images)
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl">
                    {availableImages.map((image, index) => {
                      const isSelected = heroImages.includes(image.url);
                      return (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-orange-500 ring-2 ring-orange-500/20' 
                              : 'border-stone-600 hover:border-stone-500'
                          }`}
                          onClick={() => { handleImageSelect(image.url, isSelected); }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleImageSelect(image.url, isSelected);
                            }
                          }}
                        >
                          <div className="aspect-video bg-stone-700 relative">
                            <img
                              src={image.url}
                              alt={image.alt}
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
                            {isSelected && (
                              <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                <div className="bg-orange-500 text-white rounded-full p-2">
                                  <Check className="h-5 w-5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    These images will rotate as the hero background on your website homepage.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

