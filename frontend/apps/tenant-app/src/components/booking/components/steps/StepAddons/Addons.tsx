import React, { useCallback, useState } from 'react';
import { CheckCircle } from 'lucide-react';

import type { AddonItem } from '@tenant-app/components/booking/hooks';
import { useAddons } from '@tenant-app/components/booking/hooks';
import { useBookingAddons, useBookingVehicle } from '@tenant-app/components/booking/state';
import { Carousel } from '@shared/ui';

import AddonDetailsModal from './AddonDetailsModal';
import Tabs from './Tabs';

interface AddonsProps {
  onAddonsSelected?: (addons: string[]) => void;
}

interface CarouselAddonItem extends AddonItem {
  position: 'center' | 'left' | 'right';
}

const Addons: React.FC<AddonsProps> = ({ onAddonsSelected }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('windows');
  const [modalAddon, setModalAddon] = useState<AddonItem | null>(null);
  // Get data from narrow selectors
  const { vehicle } = useBookingVehicle();
  const { addons, setAddons } = useBookingAddons();

  // Use the data hook for addons
  const { availableAddons, isLoading: _isLoading, error } = useAddons(
    vehicle || '', 
    selectedCategory
  );

  // Define handlers before any conditional returns to follow hooks rules
  const handleAddonToggle = useCallback((addonId: string) => {
    // Enforce single selection: selecting a new addon replaces any existing selection.
    const newSelection = addons.includes(addonId) ? [] : [addonId];

    setAddons(newSelection);
    onAddonsSelected?.(newSelection);
  }, [addons, setAddons, onAddonsSelected]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCardClick = (addon: AddonItem) => {
    setModalAddon(addon);
  };

  const handleCloseModal = () => {
    setModalAddon(null);
  };

  const renderAddonCard = (addon: CarouselAddonItem) => {
    const isAddonSelected = addons.includes(addon.id);
    
    return (
      <div
        className={`bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 transform cursor-pointer w-[416px] flex-shrink-0 relative ${
          addon.position === 'center'
            ? `scale-100 z-10 ring-2 ${isAddonSelected ? 'ring-green-500' : 'ring-orange-500'}`
            : addon.position === 'left'
            ? 'scale-90 -translate-x-4 opacity-70'
            : 'scale-90 translate-x-4 opacity-70'
        }`}
        onClick={() => {
          handleCardClick(addon);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(addon);
          }
        }}
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
            ${Number(addon.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Description and Features */}
        <div className="mb-5">
          <p className="text-stone-300 text-base mb-5">{addon.description}</p>
          
          {/* Features List */}
          {addon.features.length > 0 && (
            <div className="space-y-3">
              {addon.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center text-base text-stone-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          )}
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

  // Guard against missing vehicle selection
  if (!vehicle) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-white text-lg">Please select a vehicle first.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading addons: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Category Tabs - Positioned between header and cards */}
      <Tabs 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      {/* Addon Carousel */}
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
          vehicleType={vehicle}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default Addons;
