import { useMemo } from 'react';

import { useAddons } from './useAddons';
import { useServiceTiers } from './useServiceTiers';
import { useBookingAddons, useBookingData, useBookingService } from '@tenant-app/components/booking/state';

/**
 * Hook to manage payment step data and calculations
 * Separates data logic from UI components
 */
export const usePaymentData = () => {
  // Get booking data from store
  const { bookingData } = useBookingData();
  const { serviceTier } = useBookingService();
  const { addons } = useBookingAddons();
  
  // Load service tiers to get actual service data
  const { serviceTiers, isLoading: serviceTiersLoading } = useServiceTiers(bookingData.vehicle || '');
  
  // Load addon data from all categories
  const { availableAddons: windowsAddons } = useAddons(bookingData.vehicle || '', 'windows');
  const { availableAddons: wheelsAddons } = useAddons(bookingData.vehicle || '', 'wheels');
  const { availableAddons: trimAddons } = useAddons(bookingData.vehicle || '', 'trim');
  const { availableAddons: engineAddons } = useAddons(bookingData.vehicle || '', 'engine');
  
  // Combine all addons from different categories
  const allAvailableAddons = useMemo(() => 
    [...windowsAddons, ...wheelsAddons, ...trimAddons, ...engineAddons],
    [windowsAddons, wheelsAddons, trimAddons, engineAddons]
  );
  
  // Find selected service tier
  const selectedService = useMemo(() => 
    serviceTiers.find(service => service.id === serviceTier),
    [serviceTiers, serviceTier]
  );
  
  // Find selected addons
  const selectedAddons = useMemo(() => 
    allAvailableAddons.filter(addon => addons.includes(addon.id)),
    [allAvailableAddons, addons]
  );
  
  // Calculate totals
  const servicePrice = selectedService?.price || 0;
  const addonsPrice = selectedAddons.reduce((total, addon) => total + addon.price, 0);
  const subtotal = servicePrice + addonsPrice;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  return {
    // Data
    bookingData,
    serviceTiers,
    allAvailableAddons,
    selectedService,
    selectedAddons,
    
    // Loading states
    serviceTiersLoading,
    
    // Calculations
    servicePrice,
    addonsPrice,
    subtotal,
    tax,
    total
  };
};
