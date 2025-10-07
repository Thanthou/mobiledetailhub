import React, { useEffect,useRef, useState } from 'react';
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';

import { Button } from '@/shared/ui';
import { FeatureDropdown } from './FeatureDropdown';
import { FeatureList } from './FeatureList';
// Disabled affiliate services import
// import { CAR_SERVICE_OPTIONS } from '@/data/affiliate-services/cars/service/features';

// Fallback empty data
const CAR_SERVICE_OPTIONS = [];
import { Service, Tier } from '../types/ServiceClasses';

// Using Service and Tier classes from ServiceClasses.ts

interface MultiTierPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceName: string, tiers: Tier[]) => void;
  initialTiers?: Tier[] | undefined;
  initialServiceName?: string;
  loading?: boolean;
  error?: string | null;
  vehicleType?: string;
  categoryType?: 'service-packages' | 'addons';
}

export const MultiTierPricingModal: React.FC<MultiTierPricingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTiers = [],
  initialServiceName = '',
  loading = false,
  error = null,
  vehicleType = 'cars',
  categoryType = 'service-packages'
}) => {
  const [serviceName, setServiceName] = useState<string>(initialServiceName);
  const [service, setService] = useState<Service>(() => {
    if (initialTiers.length > 0) {
      const service = new Service('temp-id', initialServiceName);
      initialTiers.forEach(tierData => {
        const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
        // Convert features to serviceOptions for the new structure
        tier.serviceOptions = tierData.features || tierData.serviceOptions || [];
        tier.enabled = tierData.enabled;
        tier.popular = tierData.popular;
        service.addTier(tier);
      });
      return service;
    } else {
      const service = new Service('temp-id', initialServiceName);
      service.addTier(createDefaultTier());
      return service;
    }
  });
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevInitialTiersRef = useRef<Tier[] | undefined>(initialTiers);
  const prevInitialServiceNameRef = useRef<string | undefined>(initialServiceName);

  // Update tiers and service name when initial values change (for editing existing services)
  useEffect(() => {
    // Force update when initialTiers has data, regardless of comparison
    const hasInitialTiers = initialTiers && initialTiers.length > 0;
    const tiersChanged = JSON.stringify(prevInitialTiersRef.current) !== JSON.stringify(initialTiers);
    const serviceNameChanged = prevInitialServiceNameRef.current !== initialServiceName;
    
    if (tiersChanged || hasInitialTiers) {
      if (initialTiers.length > 0) {
        // Convert old format to new Service class format
        const service = new Service('temp-id', initialServiceName);
        initialTiers.forEach(tierData => {
          const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
          // Convert features to serviceOptions for the new structure
          tier.serviceOptions = tierData.features || tierData.serviceOptions || [];
          tier.enabled = tierData.enabled;
          tier.popular = tierData.popular;
          service.addTier(tier);
        });
        setService(service);
      } else {
        const service = new Service('temp-id', initialServiceName);
        service.addTier(createDefaultTier());
        setService(service);
      }
      // Reset editing state when switching between create/edit modes
      setEditingTierId(null);
      setEditingTier(null);
      prevInitialTiersRef.current = initialTiers;
    }
    
    if (serviceNameChanged) {
      setServiceName(initialServiceName);
      prevInitialServiceNameRef.current = initialServiceName;
    }
  }, [initialTiers, initialServiceName]);

  function createDefaultTier(): Tier {
    return new Tier(
      `tier-${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`,
      '',
      0,
      60
    );
  }

  // Helper function to ensure tier is a Tier class instance
  const ensureTierInstance = (tier: any): Tier => {
    if (tier instanceof Tier) {
      return tier;
    } else {
      // Convert plain object back to Tier instance
      const tierInstance = new Tier(tier.id, tier.name, tier.price, tier.duration);
      tierInstance.serviceOptions = tier.serviceOptions || [];
      tierInstance.tierCopies = tier.tierCopies || {};
      tierInstance.enabled = tier.enabled;
      tierInstance.popular = tier.popular;
      return tierInstance;
    }
  }

  const addTier = () => {
    setService(prev => {
      const newService = new Service(prev.id, prev.name);
      prev.tiers.forEach(tier => {
        newService.addTier(ensureTierInstance(tier));
      });
      newService.addTier(createDefaultTier());
      return newService;
    });
    // Scroll to the right to show the new tier
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }, 100);
  };

  const removeTier = (tierId: string) => {
    if (service.tiers.length > 1) {
    setService(prev => {
      const newService = new Service(prev.id, prev.name);
      prev.tiers.forEach(tier => {
        if (tier.id !== tierId) {
          newService.addTier(ensureTierInstance(tier));
        }
      });
      return newService;
    });
      if (editingTierId === tierId) {
        setEditingTierId(null);
        setEditingTier(null);
      }
    }
  };

  const startEditing = (tier: Tier) => {
    setEditingTierId(tier.id);
    setEditingTier({ ...tier });
  };

  const saveTier = () => {
    if (editingTier) {
    setService(prev => {
      const newService = new Service(prev.id, prev.name);
      prev.tiers.forEach(tier => {
        if (tier.id === editingTier.id) {
          newService.addTier(editingTier);
        } else {
          newService.addTier(ensureTierInstance(tier));
        }
      });
      return newService;
    });
      setEditingTierId(null);
      setEditingTier(null);
    }
  };

  const cancelEditing = () => {
    setEditingTierId(null);
    setEditingTier(null);
  };

  const updateEditingTier = (field: keyof Tier, value: string | number | boolean | string[]) => {
    if (editingTier) {
      setEditingTier({ ...editingTier, [field]: value });
    }
  };

  const toggleTierExpansion = (tierName: string) => {
    setExpandedTiers(prev => ({
      ...prev,
      [tierName]: !prev[tierName]
    }));
  };



  const handleSubmit = () => {
    // Validate service name
    if (!serviceName.trim()) {
      return;
    }
    
    // Filter out tiers with empty names and convert to backend format
    const validTiers = service.tiers
      .filter(tier => tier.name.trim() !== '')
      .map(tier => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        features: tier.serviceOptions, // Convert serviceOptions to features for backend
        enabled: tier.enabled,
        popular: tier.popular
      }));
    
    if (validTiers.length > 0) {
      onSubmit(serviceName.trim(), validTiers);
    }
  };

  const handleClose = () => {
    // Reset to initial state when closing
    if (initialTiers.length > 0) {
      const service = new Service('temp-id', initialServiceName);
      initialTiers.forEach(tierData => {
        const tier = new Tier(tierData.id, tierData.name, tierData.price, tierData.duration);
        tier.serviceOptions = tierData.features || tierData.serviceOptions || [];
        tier.enabled = tierData.enabled;
        tier.popular = tierData.popular;
        service.addTier(tier);
      });
      setService(service);
    } else {
      const service = new Service('temp-id', initialServiceName);
      service.addTier(createDefaultTier());
      setService(service);
    }
    setServiceName(initialServiceName);
    setEditingTierId(null);
    setEditingTier(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Multi-Tier Pricing</h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
              <div className="text-red-200 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
          
          {/* Service Name */}
          <div className="mb-6">
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-300 mb-2">
              Service Name
            </label>
            <input
              id="service-name"
              type="text"
              value={serviceName}
              onChange={(e) => { setServiceName(e.target.value); }}
              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Premium Auto Detail, Basic Wash, etc."
            />
          </div>
          
          {/* Tiers Container */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Service Tiers</h3>
              <Button
                onClick={addTier}
                variant="primary"
                size="md"
                className="px-4 py-2"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Tier
              </Button>
            </div>

            {/* Scrollable Tiers */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#6B7280 #374151'
              }}
            >
              {service.tiers.map((tier, index) => {
                // Ensure tier is a Tier class instance
                const tierInstance = ensureTierInstance(tier);
                return (
                <div
                  key={tierInstance.id}
                  className={`min-w-[300px] bg-gray-700 rounded-lg p-4 border-2 ${
                    editingTierId === tierInstance.id ? 'border-blue-500' : 'border-gray-600'
                  }`}
                >
                  {/* Tier Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Tier {index + 1}</span>
                    <div className="flex gap-2">
                      {editingTierId === tier.id ? (
                        <>
                          <Button
                            onClick={saveTier}
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300 p-1"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={cancelEditing}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-300 p-1"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => { startEditing(tier); }}
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {service.tiers.length > 1 && (
                        <Button
                          onClick={() => { removeTier(tier.id); }}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Remove Tier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Tier Content */}
                  {editingTierId === tier.id && editingTier ? (
                    <div className="space-y-3">
                      {/* Tier Name */}
                      <div>
                        <label htmlFor={`tier-name-${tier.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                          Tier Name
                        </label>
                        <input
                          id={`tier-name-${tier.id}`}
                          type="text"
                          value={editingTier.name}
                          onChange={(e) => { updateEditingTier('name', e.target.value); }}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Basic, Premium, Ultimate"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label htmlFor={`tier-price-${tier.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                          Price ($)
                        </label>
                        <input
                          id={`tier-price-${tier.id}`}
                          type="text"
                          value={editingTier.price}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow numbers, decimal point, and empty string
                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                              const numValue = value === '' ? 0 : parseFloat(value) || 0;
                              updateEditingTier('price', numValue);
                            }
                          }}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Duration */}
                      <div>
                        <label htmlFor={`tier-duration-${tier.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          id={`tier-duration-${tier.id}`}
                          type="text"
                          value={editingTier.duration}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers and empty string
                            if (value === '' || /^\d+$/.test(value)) {
                              const numValue = value === '' ? 0 : parseInt(value, 10);
                              updateEditingTier('duration', numValue);
                            }
                          }}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="60"
                        />
                      </div>

                      {/* Features */}
                      <FeatureDropdown
                        selectedFeatures={editingTier.serviceOptions}
                        onFeaturesChange={(features) => updateEditingTier('serviceOptions', features)}
                        vehicleType={vehicleType}
                        categoryType={categoryType}
                        serviceName={serviceName}
                        disabled={false}
                      />

                      {/* Toggles */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingTier.enabled}
                            onChange={(e) => { updateEditingTier('enabled', e.target.checked); }}
                            className="rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">Enabled</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingTier.popular}
                            onChange={(e) => { updateEditingTier('popular', e.target.checked); }}
                            className="rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">Popular</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Display Mode */}
                      <div>
                        <h4 className="font-medium text-white mb-2">
                          {tierInstance.name || `Tier ${(index + 1).toString()}`}
                        </h4>
                        <div className="text-2xl font-bold text-green-400">
                          ${tierInstance.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {tierInstance.duration} minutes
                        </div>
                      </div>

                      {/* Features */}
                      {tierInstance.serviceOptions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Features:</h5>
                          <ul className="space-y-1">
                            {tierInstance.serviceOptions.map(option => {
                              const serviceOption = CAR_SERVICE_OPTIONS.find(s => s.id === option);
                              
                              return (
                                <li key={option} className="text-sm text-gray-300 flex items-center">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                  {serviceOption?.name || option}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex gap-2">
                        {!tier.enabled && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200">
                            Disabled
                          </span>
                        )}
                        {tier.popular && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>

          
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="md"
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="md"
            loading={loading}
            disabled={!serviceName.trim() || service.tiers.filter(t => t.name.trim()).length === 0}
            className="px-6 py-2"
          >
            {loading ? 'Saving...' : 'Save Service'}
          </Button>
        </div>
      </div>
    </div>
  );
};
