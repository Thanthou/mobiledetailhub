import { useCallback, useState } from 'react';

import type { ServiceTier } from '../types';

export const useTierSelection = () => {
  const [currentTierIndex, setCurrentTierIndex] = useState<{ [serviceId: string]: number }>({});
  const [selectedTierForService, setSelectedTierForService] = useState<{ [serviceId: string]: string }>({});

  const getTierPosition = useCallback((serviceId: string, tierIndex: number): 'center' | 'left' | 'right' | 'hidden' => {
    const currentIndex = currentTierIndex[serviceId] || 0;
    const diff = tierIndex - currentIndex;
    
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    
    return 'hidden';
  }, [currentTierIndex]);

  const goLeft = useCallback((serviceId: string) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: Math.max(0, (prev[serviceId] || 0) - 1)
    }));
  }, []);

  const goRight = useCallback((serviceId: string, tiers: ServiceTier[]) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: Math.min(tiers.length - 1, (prev[serviceId] || 0) + 1)
    }));
  }, []);

  const selectTier = useCallback((serviceId: string, tierIndex: number, availableServices: any[], onServiceChange: (serviceId: string) => void, onTierChange: (serviceId: string, tierId: string) => void) => {
    setCurrentTierIndex(prev => ({
      ...prev,
      [serviceId]: tierIndex
    }));
    
    // Find the actual tier ID from the service
    const service = availableServices.find(s => s.id === serviceId);
    if (service && service.tiers && service.tiers[tierIndex]) {
      const tierId = service.tiers[tierIndex].id;
      const isCurrentlySelected = selectedTierForService[serviceId] === tierId;
      
      if (isCurrentlySelected) {
        // Clear tier selection but keep service selected (stay in carousel view)
        setSelectedTierForService(prev => {
          const { [serviceId]: removed, ...newState } = prev;
          void removed; // Explicitly mark as intentionally unused
          return newState;
        });
      } else {
        // Select the service and tier
        onServiceChange(serviceId);
        onTierChange(serviceId, tierId);
        setSelectedTierForService(prev => ({
          ...prev,
          [serviceId]: tierId
        }));
      }
    }
  }, [selectedTierForService]);

  const clearTierSelection = useCallback(() => {
    setSelectedTierForService({});
  }, []);

  const initializeTierPositions = useCallback((availableServices: any[]) => {
    const newPositions: { [serviceId: string]: number } = {};
    
    availableServices.forEach(service => {
      if (service.tiers && service.tiers.length > 0) {
        // Find the first popular tier
        const popularTierIndex = service.tiers.findIndex((tier: ServiceTier) => tier.popular === true);
        
        if (popularTierIndex !== -1) {
          // Set the popular tier as the center position
          newPositions[service.id] = popularTierIndex;
        } else {
          // Default to first tier if no popular tier found
          newPositions[service.id] = 0;
        }
      }
    });
    
    setCurrentTierIndex(prev => ({
      ...prev,
      ...newPositions
    }));
  }, []);

  return {
    currentTierIndex,
    selectedTierForService,
    getTierPosition,
    goLeft,
    goRight,
    selectTier,
    clearTierSelection,
    initializeTierPositions,
  };
};
