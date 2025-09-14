import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';
import { getServiceDisplayNames, getServiceDescription, getServiceFeatures } from '../../../utils/serviceNameMapping';

import type { Service, ServiceTier } from '../../../types';

interface StepAddonsProps {
  availableAddons: Service[];
  selectedTierForAddon: { [addonId: string]: string };
  onAddonToggle: (addonId: string, tierId?: string) => void;
  onTierModalOpen: (tier: ServiceTier) => void;
  onNext: () => void;
  onBack: () => void;
  onBackToHome: () => void;
  averageRating: number;
  totalReviews: number;
}

const StepAddons: React.FC<StepAddonsProps> = ({
  availableAddons,
  selectedTierForAddon,
  onAddonToggle,
  onTierModalOpen,
  onNext,
  onBack,
  onBackToHome,
  averageRating,
  totalReviews,
}) => {
  const [activeAddonTab, setActiveAddonTab] = useState<string>('');
  const [currentTierIndex, setCurrentTierIndex] = useState<{ [addonId: string]: number }>({});

  // Initialize active tab and tier positions when addons are loaded
  useEffect(() => {
    if (availableAddons.length > 0 && !activeAddonTab) {
      setActiveAddonTab(availableAddons[0].id);
      
      // Initialize tier positions for each addon
      const newTierPositions: { [addonId: string]: number } = {};
      availableAddons.forEach(addon => {
        if (addon.tiers && addon.tiers.length > 0) {
          // Find popular tier or default to first
          const popularTierIndex = addon.tiers.findIndex(tier => tier.popular === true);
          newTierPositions[addon.id] = popularTierIndex !== -1 ? popularTierIndex : 0;
        }
      });
      setCurrentTierIndex(newTierPositions);
    }
  }, [availableAddons, activeAddonTab]);

  const toggleAddon = (addonId: string, tierId?: string) => {
    onAddonToggle(addonId, tierId);
  };

  const navigateTier = (addonId: string, direction: 'left' | 'right') => {
    const addon = availableAddons.find(a => a.id === addonId);
    if (!addon || !addon.tiers) return;

    const currentIndex = currentTierIndex[addonId] || 0;
    const totalTiers = addon.tiers.length;
    
    let newIndex;
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : totalTiers - 1;
    } else {
      newIndex = currentIndex < totalTiers - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentTierIndex(prev => ({
      ...prev,
      [addonId]: newIndex
    }));
  };

  const getTierPosition = (addonId: string, tierIndex: number, totalTiers: number): 'center' | 'left' | 'right' | 'center-left' | 'center-right' | 'hidden' => {
    const currentIndex = currentTierIndex[addonId] || 0;
    
    // Adjust for dummy cards - real indices are 1 to totalTiers
    const adjustedCurrentIndex = currentIndex + 1;
    const diff = tierIndex - adjustedCurrentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  };

  const renderTierCard = (tier: ServiceTier | null, addonId: string, tierIndex: number, totalTiers: number, addonType?: 'wheels' | 'windows' | 'trim') => {
    // Skip dummy cards (index 0 and last index)
    if (tierIndex === 0 || tierIndex === totalTiers + 1) {
      const position = getTierPosition(addonId, tierIndex, totalTiers + 2);
      if (position === 'hidden') return null;
      
      // Render invisible dummy card
      return (
        <div
          key={`dummy-${addonId}-${tierIndex}`}
          className="bg-transparent rounded-xl p-6 text-center transition-all duration-300 transform flex-1 scale-90 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="h-full invisible">Dummy</div>
        </div>
      );
    }
    
    // Adjust tier index for real cards (subtract 1 to get actual tier)
    const realTierIndex = tierIndex - 1;
    const realTier = tier;
    
    const position = getTierPosition(addonId, tierIndex, totalTiers);
    const isSelected = selectedTierForAddon[addonId] === realTier.id;
    
    if (position === 'hidden' || !realTier) return null;

    const features = realTier.features || [];
    const displayNames = getServiceDisplayNames(features, addonType);

    const baseClasses = "relative bg-stone-800/80 backdrop-blur-sm rounded-xl p-9 text-center transition-all duration-300 transform cursor-pointer flex-1";
    
    const positionClasses = {
      center: "scale-100 z-10 ring-2 ring-orange-500",
      left: "scale-90 -translate-x-2 opacity-70",
      right: "scale-90 translate-x-2 opacity-70"
    };
    
    let finalClasses = `${baseClasses} ${positionClasses[position]}`;
    
    if (isSelected) {
      finalClasses = finalClasses.replace('ring-orange-500', 'ring-green-500') + ' bg-green-800/80';
    }

    return (
      <div
        key={realTier.id}
        className={finalClasses}
        onClick={() => onTierModalOpen(realTier)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTierModalOpen(realTier);
          }
        }}
      >
        {/* Popular Badge */}
        {realTier.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              POPULAR
            </div>
          </div>
        )}


        {/* Tier Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">{realTier.name}</h3>
          <p className="text-3xl font-bold text-orange-500">${realTier.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          {realTier.originalPrice && realTier.originalPrice > realTier.price && (
            <p className="text-lg text-gray-400 line-through">${realTier.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>

        {/* Features */}
        {displayNames.length > 0 && (
          <div className="mb-6">
            <div className="space-y-3">
              {displayNames.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-stone-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Select Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            toggleAddon(addonId, realTier.id);
            // Center the selected tier
            setCurrentTierIndex(prev => ({
              ...prev,
              [addonId]: realTierIndex
            }));
          }}
          variant={isSelected ? "primary" : "secondary"}
          size="lg"
          className={`w-full text-lg py-4 ${
            isSelected 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
          leftIcon={isSelected ? <CheckCircle size={20} /> : undefined}
        >
          {isSelected ? 'Selected' : 'Select Addon'}
        </Button>
      </div>
    );
  };

  const getAddonOrder = (addonName: string): number => {
    const order = ['Wheels', 'Windows', 'Trim'];
    return order.indexOf(addonName);
  };

  const renderAddonTabs = () => {
    // Sort addons by the specified order: Wheels, Windows, Trim
    const sortedAddons = [...availableAddons].sort((a, b) => {
      const orderA = getAddonOrder(a.name);
      const orderB = getAddonOrder(b.name);
      // If addon is not in the order list, put it at the end
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });

    return (
      <div className="flex justify-center space-x-1 mb-6 overflow-x-auto">
        {sortedAddons.map((addon) => (
          <button
            key={addon.id}
            onClick={() => setActiveAddonTab(addon.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeAddonTab === addon.id
                ? 'bg-orange-500 text-white'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
          >
            {addon.name}
          </button>
        ))}
      </div>
    );
  };

  const renderTierCarousel = () => {
    const activeAddon = availableAddons.find(addon => addon.id === activeAddonTab);
    if (!activeAddon || !activeAddon.tiers || activeAddon.tiers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-stone-400 text-lg">No tiers available for this addon.</p>
        </div>
      );
    }

    const currentIndex = currentTierIndex[activeAddon.id] || 0;
    const canGoLeft = currentIndex > 0;
    const canGoRight = currentIndex < activeAddon.tiers.length - 1;

    return (
      <div className="relative">
        {/* Navigation Arrows */}
        {canGoLeft && (
          <button
            onClick={() => navigateTier(activeAddon.id, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-full transition-colors"
            aria-label="Previous tier"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
        )}

        {canGoRight && (
          <button
            onClick={() => navigateTier(activeAddon.id, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-full transition-colors"
            aria-label="Next tier"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
        )}

        {/* Tier Cards */}
        <div className="flex justify-center items-start py-8">
          <div className="flex gap-4 w-full max-w-5xl justify-center">
            {/* Create array with dummy cards at start and end */}
            {[null, ...activeAddon.tiers, null].map((tier, index) => 
              renderTierCard(tier, activeAddon.id, index, activeAddon.tiers.length, activeAddon.tiers[0]?.addonType)
            )}
          </div>
        </div>

        {/* Tier Indicators */}
        {activeAddon.tiers.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {activeAddon.tiers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTierIndex(prev => ({ ...prev, [activeAddon.id]: index }))}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-orange-500' 
                    : 'bg-stone-600 hover:bg-stone-500'
                }`}
                aria-label={`Go to tier ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <StepContainer
      title="Choose Add-ons"
      subtitle="Enhance your service with additional options"
      averageRating={averageRating}
      totalReviews={totalReviews}
      onBackToHome={onBackToHome}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Addon Tabs and Carousel */}
        <div className="flex flex-col justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          {availableAddons.length > 0 ? (
            <div className="space-y-6">
              {/* Addon Tabs */}
              {renderAddonTabs()}
              
              {/* Tier Carousel */}
              {renderTierCarousel()}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-400 text-lg">No add-ons available for this service.</p>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <StepBottomSection
          onBack={onBack}
          onNext={onNext}
          showBack={true}
          showNext={true}
          nextText="Continue"
          averageRating={averageRating}
          totalReviews={totalReviews}
          currentStep={3}
          totalSteps={5}
        />
      </div>
    </StepContainer>
  );
};

export default StepAddons;
