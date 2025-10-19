import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Image, Plus } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GallerySectionProps {
  stockImages: GalleryImage[];
  customImages: GalleryImage[];
  onAddCustomImage: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  stockImages,
  customImages,
  onAddCustomImage,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'stock' | 'custom'>('stock');

  return (
    <div className="bg-stone-800 rounded-lg p-6 border border-stone-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image className="h-5 w-5 text-orange-400 mr-3" />
          <h3 className="text-lg font-semibold text-white">Gallery</h3>
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
          {/* Gallery Sub-tabs */}
          <div className="flex space-x-1 bg-stone-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => { setActiveTab('stock'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stock'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Image className="h-4 w-4 mr-2" />
              Stock
            </button>
            <button
              onClick={() => { setActiveTab('custom'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Custom
            </button>
          </div>

          {/* Gallery Sub-tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === 'stock' && (
              <div className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-300 mb-2">Stock Gallery Images</div>
                  <div className="grid grid-cols-4 gap-4 max-w-6xl">
                    {stockImages.map((imageItem, index) => (
                      <div
                        key={`stock-${index}`}
                        className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                      >
                        <div className="aspect-square bg-stone-700 relative">
                          <img
                            src={imageItem.src}
                            alt={imageItem.alt}
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
                        <div className="p-2 bg-stone-800">
                          <p className="text-xs text-gray-300 truncate">
                            {imageItem.alt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {stockImages.length} stock gallery images loaded from gallery.json
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="block text-sm font-medium text-gray-300">Custom Gallery Images</div>
                    <button
                      onClick={onAddCustomImage}
                      className="flex items-center px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Custom Image
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 max-w-6xl">
                    {customImages.map((imageItem, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-stone-600 hover:border-stone-500 transition-all duration-200"
                      >
                        <div className="aspect-square bg-stone-700 relative">
                          {imageItem.src ? (
                            <img
                              src={imageItem.src}
                              alt={imageItem.alt || 'Custom gallery image'}
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
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              <div className="text-center">
                                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Add Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-stone-800">
                          <p className="text-xs text-gray-300 truncate">
                            {imageItem.alt || 'Custom Image'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {customImages.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No custom images yet</p>
                      <p className="text-xs mt-1">Click &quot;Add Custom Image&quot; to get started</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    {customImages.length} custom gallery images
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

