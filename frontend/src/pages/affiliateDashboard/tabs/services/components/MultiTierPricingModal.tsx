import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit2, Save, Trash2 } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

interface MultiTierPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceName: string, tiers: Tier[]) => void;
  initialTiers?: Tier[] | undefined;
  initialServiceName?: string;
  loading?: boolean;
  error?: string | null;
}

export const MultiTierPricingModal: React.FC<MultiTierPricingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTiers = [],
  initialServiceName = '',
  loading = false,
  error = null
}) => {
  const [serviceName, setServiceName] = useState<string>(initialServiceName);
  const [tiers, setTiers] = useState<Tier[]>(initialTiers.length > 0 ? initialTiers : [createDefaultTier()]);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevInitialTiersRef = useRef<Tier[] | undefined>(initialTiers);
  const prevInitialServiceNameRef = useRef<string | undefined>(initialServiceName);

  // Update tiers and service name when initial values change (for editing existing services)
  useEffect(() => {
    // Only update if initialTiers actually changed
    const tiersChanged = JSON.stringify(prevInitialTiersRef.current) !== JSON.stringify(initialTiers);
    const serviceNameChanged = prevInitialServiceNameRef.current !== initialServiceName;
    
    if (tiersChanged) {
      if (initialTiers && initialTiers.length > 0) {
        setTiers(initialTiers);
      } else {
        setTiers([createDefaultTier()]);
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
    return {
      id: `tier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      price: 0,
      duration: 60,
      features: [''],
      enabled: true,
      popular: false
    };
  }

  const addTier = () => {
    setTiers(prev => [...prev, createDefaultTier()]);
    // Scroll to the right to show the new tier
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    }, 100);
  };

  const removeTier = (tierId: string) => {
    if (tiers.length > 1) {
      setTiers(prev => prev.filter(tier => tier.id !== tierId));
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
      setTiers(prev => prev.map(tier => 
        tier.id === editingTier.id ? editingTier : tier
      ));
      setEditingTierId(null);
      setEditingTier(null);
    }
  };

  const cancelEditing = () => {
    setEditingTierId(null);
    setEditingTier(null);
  };

  const updateEditingTier = (field: keyof Tier, value: any) => {
    if (editingTier) {
      setEditingTier({ ...editingTier, [field]: value });
    }
  };

  const addFeature = (tierId: string) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        features: [...editingTier.features, '']
      });
    }
  };

  const removeFeature = (tierId: string, featureIndex: number) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        features: editingTier.features.filter((_, index) => index !== featureIndex)
      });
    }
  };

  const updateFeature = (tierId: string, featureIndex: number, value: string) => {
    if (editingTier) {
      setEditingTier({
        ...editingTier,
        features: editingTier.features.map((feature, index) => 
          index === featureIndex ? value : feature
        )
      });
    }
  };

  const handleSubmit = () => {
    // Validate service name
    if (!serviceName.trim()) {
      return;
    }
    
    // Filter out tiers with empty names
    const validTiers = tiers.filter(tier => tier.name.trim() !== '');
    if (validTiers.length > 0) {
      onSubmit(serviceName.trim(), validTiers);
    }
  };

  const handleClose = () => {
    // Reset to initial state when closing
    if (initialTiers.length > 0) {
      setTiers(initialTiers);
    } else {
      setTiers([createDefaultTier()]);
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
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Premium Auto Detail, Basic Wash, etc."
            />
          </div>
          
          {/* Tiers Container */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Service Tiers</h3>
              <button
                onClick={addTier}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Tier
              </button>
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
              {tiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={`min-w-[300px] bg-gray-700 rounded-lg p-4 border-2 ${
                    editingTierId === tier.id ? 'border-blue-500' : 'border-gray-600'
                  }`}
                >
                  {/* Tier Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Tier {index + 1}</span>
                    <div className="flex gap-2">
                      {editingTierId === tier.id ? (
                        <>
                          <button
                            onClick={saveTier}
                            className="text-green-400 hover:text-green-300 transition-colors"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditing(tier)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {tiers.length > 1 && (
                        <button
                          onClick={() => removeTier(tier.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remove Tier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tier Content */}
                  {editingTierId === tier.id && editingTier ? (
                    <div className="space-y-3">
                      {/* Tier Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Tier Name
                        </label>
                        <input
                          type="text"
                          value={editingTier.name}
                          onChange={(e) => updateEditingTier('name', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Basic, Premium, Ultimate"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Price ($)
                        </label>
                        <input
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Duration (minutes)
                        </label>
                        <input
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
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Features
                        </label>
                        <div className="space-y-2">
                          {editingTier.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => updateFeature(editingTier.id, featureIndex, e.target.value)}
                                className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter feature description"
                              />
                              {editingTier.features.length > 1 && (
                                <button
                                  onClick={() => removeFeature(editingTier.id, featureIndex)}
                                  className="text-red-400 hover:text-red-300 transition-colors px-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addFeature(editingTier.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            Add Feature
                          </button>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingTier.enabled}
                            onChange={(e) => updateEditingTier('enabled', e.target.checked)}
                            className="rounded border-gray-500 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">Enabled</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingTier.popular}
                            onChange={(e) => updateEditingTier('popular', e.target.checked)}
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
                          {tier.name || `Tier ${index + 1}`}
                        </h4>
                        <div className="text-2xl font-bold text-green-400">
                          ${tier.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {tier.duration} minutes
                        </div>
                      </div>

                      {/* Features */}
                      {tier.features && tier.features.length > 0 && tier.features.some(f => f && f.trim() !== '') && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Features:</h5>
                          <ul className="space-y-1">
                            {tier.features.map((feature, featureIndex) => (
                              feature && feature.trim() !== '' && (
                                <li key={featureIndex} className="text-sm text-gray-400 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  {feature}
                                </li>
                              )
                            ))}
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
              ))}
            </div>
          </div>

          
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !serviceName.trim() || tiers.filter(t => t.name.trim()).length === 0}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
};
