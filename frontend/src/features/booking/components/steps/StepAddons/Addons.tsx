import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useBookingStore } from '@/features/booking/state';
import { getCardDescription } from '@/features/booking/utils/displayUtils';
import { Carousel } from '@/shared/ui';
import AddonDetailsModal from './AddonDetailsModal';
import Header from './Header';
import Tabs from './Tabs';

interface AddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  featureIds: string[];
  popular?: boolean;
}

interface AddonsProps {
  onAddonsSelected?: (addons: string[]) => void;
}

const Addons: React.FC<AddonsProps> = ({ onAddonsSelected }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('windows');
  const [availableAddons, setAvailableAddons] = useState<AddonItem[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [modalAddon, setModalAddon] = useState<AddonItem | null>(null);
  const { bookingData, setAddons } = useBookingStore();

  console.log('🔍 Addons component render:', { selectedCategory, vehicle: bookingData.vehicle });

  // Load addons based on vehicle type and category
  useEffect(() => {
    console.log('🔍 useEffect triggered:', { selectedCategory, vehicle: bookingData.vehicle });
    if (selectedCategory && bookingData.vehicle) {
      console.log('🔍 Calling loadAddonsForCategory');
      loadAddonsForCategory(bookingData.vehicle, selectedCategory);
    } else {
      console.log('🔍 Missing required data:', { selectedCategory, vehicle: bookingData.vehicle });
    }
  }, [selectedCategory, bookingData.vehicle]);

  const loadAddonsForCategory = async (vehicleType: string, category: string) => {
    try {
      console.log('🔍 Loading addons for:', { vehicleType, category });
      
      const vehicleFolderMap: Record<string, string> = {
        'car': 'cars',
        'truck': 'trucks',
        'suv': 'suvs',
        'boat': 'boats',
        'rv': 'rvs'
      };

      const folderName = vehicleFolderMap[vehicleType];
      console.log('🔍 Mapped folder name:', folderName);
      
      if (!folderName) {
        console.log('❌ No folder mapping found for vehicle type:', vehicleType);
        setAvailableAddons([]);
        return;
      }

      // Try to load service.json first (for windows), then fall back to category-specific files
      let processedAddons: AddonItem[] = [];
      
      try {
        // Try to load service.json (windows structure)
        const addonsData = await import(`@/data/affiliate-services/${folderName}/addons/${category}/service.json`);
        const featuresData = await import(`@/data/affiliate-services/${folderName}/addons/${category}/features.json`);
        
        console.log('🔍 Raw addons data (service.json):', addonsData.default);
        console.log('🔍 Raw features data:', featuresData.default);
        
        // Process addons object (windows data structure)
        processedAddons = Object.entries(addonsData.default).map(([name, addon]: [string, any]) => {
          const featureNames = addon.features.map((featureId: string) => getFeatureName(featureId, featuresData.default));
          console.log('🔍 Processing addon:', name, 'features:', addon.features, 'featureNames:', featureNames);
          
          // Use description from addon data, with fallback to feature names
          const description = getCardDescription(addon, addon.features, featuresData.default);
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            price: addon.cost || 0,
            description: description,
            features: featureNames,
            featureIds: addon.features || [],
            popular: addon.popular || false
          };
        });
      } catch (serviceError) {
        console.log('🔍 No service.json found, trying category-specific file');
        
        try {
          // Try to load category-specific file (wheels.json, trim.json, etc.)
          const categoryData = await import(`@/data/affiliate-services/${folderName}/addons/${category}/${category}.json`);
          
          console.log('🔍 Raw category data:', categoryData.default);
          
          // Convert features object to addon array format
          const features = Object.keys(categoryData.default);
          processedAddons = features.map((featureKey: string, index: number) => {
            const feature = categoryData.default[featureKey];
            return {
              id: featureKey,
              name: feature.name,
              price: 0, // No pricing in features-only files
              description: feature.description || getCardDescription(feature, [featureKey], {}),
              features: [feature.name], // Use the feature name as the single feature
              featureIds: [featureKey],
              popular: index === 0 // Make first item popular
            };
          });
        } catch (categoryError) {
          console.log('🔍 No category-specific file found, no addons available');
          processedAddons = [];
        }
      }
      
      setAvailableAddons(processedAddons);
      console.log(`📊 Loaded ${category} addons for ${vehicleType}:`, processedAddons);
      
      // Carousel will automatically center on popular item
    } catch (error) {
      console.error(`❌ Error loading ${category} addons for ${vehicleType}:`, error);
      setAvailableAddons([]);
    }
  };

    // Helper function to get feature name from feature ID
    const getFeatureName = (featureId: string, featuresData: any): string => {
      return featuresData[featureId]?.name || featureId;
    };


  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => {
      const newSelection = prev.includes(addonId)
        ? prev.filter(id => id !== addonId) // Remove if already selected
        : [...prev, addonId]; // Add if not selected
      
      // Update Zustand store
      setAddons(newSelection);
      // Call parent callback if provided
      onAddonsSelected?.(newSelection);
      return newSelection;
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    console.log('🔍 Tab clicked:', categoryId);
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (addon: AddonItem) => {
    setModalAddon(addon);
  };

  const handleCloseModal = () => {
    setModalAddon(null);
  };

  const renderAddonCard = (addon: AddonItem & { position: 'center' | 'left' | 'right' }, _isSelected: boolean) => {
    const isAddonSelected = selectedAddons.includes(addon.id);
    
    return (
      <div
        className={`bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 transform cursor-pointer w-[416px] flex-shrink-0 relative ${
          addon.position === 'center'
            ? `scale-100 z-10 ring-2 ${isAddonSelected ? 'ring-green-500' : 'ring-orange-500'}`
            : addon.position === 'left'
            ? 'scale-90 -translate-x-4 opacity-70'
            : 'scale-90 translate-x-4 opacity-70'
        }`}
        onClick={() => handleCardClick(addon)}
      >
        {/* Popular Badge */}
        {addon.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-base font-medium">
              Most Popular
            </span>
          </div>
        )}

        {/* Addon Header */}
        <div className="mb-5">
          <h3 className="text-3xl font-bold text-white mb-3">{addon.name}</h3>
          <p className="text-4xl font-bold text-orange-500">
            ${addon.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Description and Features */}
        <div className="mb-5">
          <p className="text-stone-300 text-base mb-5">{addon.description}</p>
          
          {/* Features List */}
          {(() => {
            console.log('🔍 Rendering addon card for:', addon.name, 'features:', addon.features);
            return addon.features && addon.features.length > 0 ? (
              <div className="space-y-3">
                {addon.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center text-base text-stone-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            ) : null;
          })()}
        </div>

        {/* Selection Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddonToggle(addon.id);
          }}
          className={`mt-8 w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-3 ${
            isAddonSelected
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isAddonSelected && <CheckCircle size={20} />}
          {isAddonSelected ? 'Selected' : 'Select Addon'}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Header />
      <Tabs 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <Carousel
        items={availableAddons}
        selectedItem=""
        onItemSelect={() => {}} // Not used for addons
        renderItem={renderAddonCard}
        onItemClick={handleCardClick}
        emptyMessage={`No add-ons available for ${selectedCategory}`}
      />

      {/* Addon Details Modal */}
      {modalAddon && (
        <AddonDetailsModal
          addon={modalAddon}
          isOpen={!!modalAddon}
          onClose={handleCloseModal}
          vehicleType={bookingData.vehicle}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default Addons;
