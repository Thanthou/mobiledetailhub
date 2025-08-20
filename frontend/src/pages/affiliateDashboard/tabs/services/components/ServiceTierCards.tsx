import React, { useState } from 'react';
import { Star, Crown, Diamond } from 'lucide-react';
import { Check, X, Edit3, Plus } from 'lucide-react';
import type { Service } from '../types';

interface ServiceTierCardsProps {
  service: Service;
  onToggleTier: (tierId: string) => void;
  onUpdateTier?: (tierId: string, updates: Partial<ServiceTier>) => void;
}

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  enabled: boolean;
  popular?: boolean;
}

export const ServiceTierCards: React.FC<ServiceTierCardsProps> = ({
  service,
  onToggleTier,
  onUpdateTier
}) => {
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ServiceTier>>({});

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'basic':
        return Star;
      case 'premium':
        return Crown;
      case 'luxury':
        return Diamond;
      default:
        return Star;
    }
  };

  const startEditing = (tier: ServiceTier) => {
    setEditingTier(tier.id);
    setEditData({
      name: tier.name,
      price: tier.price,
      duration: tier.duration,
      features: [...tier.features]
    });
  };

  const saveChanges = () => {
    if (editingTier && onUpdateTier) {
      onUpdateTier(editingTier, editData);
    }
    setEditingTier(null);
    setEditData({});
  };

  const cancelEditing = () => {
    setEditingTier(null);
    setEditData({});
  };

  const isEditing = (tierId: string) => editingTier === tierId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {service.tiers.map((tier) => {
        const TierIcon = getTierIcon(tier.name);

        return (
          <div
            key={tier.id}
            className={`bg-stone-800 rounded-lg border p-6 relative transition-all cursor-pointer hover:border-stone-600 ${
              isEditing(tier.id) 
                ? 'border-orange-500 shadow-lg' 
                : 'border-stone-700'
            }`}
            onClick={() => !isEditing(tier.id) && startEditing(tier)}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {/* Edit Controls */}
            {isEditing(tier.id) && (
              <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={(e) => { e.stopPropagation(); saveChanges(); }} className="bg-green-500 hover:bg-green-600 text-white p-1 rounded">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); cancelEditing(); }} className="bg-red-500 hover:bg-red-600 text-white p-1 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="text-center mb-6">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TierIcon className="h-6 w-6 text-white" />
              </div>
              
              {/* Tier Name */}
              {isEditing(tier.id) ? (
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xl font-bold text-white mb-2 bg-stone-700 border border-stone-600 rounded px-2 py-1 text-center w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              )}
              
              {/* Price */}
              <div className="flex items-center justify-center mb-1">
                <span className="text-3xl font-bold text-white">$</span>
                {isEditing(tier.id) ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.price || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    onClick={(e) => e.stopPropagation()}
                    className="text-3xl font-bold text-white bg-stone-700 border border-stone-600 rounded px-2 py-1 text-center w-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">{tier.price.toFixed(2)}</span>
                )}
              </div>
              
              {/* Duration */}
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                {isEditing(tier.id) ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={editData.duration || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, duration: parseFloat(e.target.value) || 0 }))}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-stone-700 border border-stone-600 rounded px-2 py-1 text-center w-16 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="ml-1">hour{(editData.duration || 0) > 1 ? 's' : ''}</span>
                  </div>
                ) : (
                  <span>{tier.duration} hour{tier.duration > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {(isEditing(tier.id) ? editData.features || [] : tier.features).map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  {isEditing(tier.id) ? (
                    <div className="flex items-center flex-1">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...(editData.features || [])];
                          newFeatures[index] = e.target.value;
                          setEditData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-stone-700 border border-stone-600 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newFeatures = [...(editData.features || [])];
                          newFeatures.splice(index, 1);
                          setEditData(prev => ({ ...prev, features: newFeatures }));
                        }}
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Remove feature"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span>{feature}</span>
                  )}
                </div>
              ))}
              
              {/* Add Feature Button - only show when editing */}
              {isEditing(tier.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFeatures = [...(editData.features || []), 'New feature'];
                    setEditData(prev => ({ ...prev, features: newFeatures }));
                  }}
                  className="flex items-center text-gray-400 hover:text-white transition-colors mt-2"
                >
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm">Add feature</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">
                {tier.enabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleTier(tier.id); }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tier.enabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tier.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Edit Hint */}
            {!isEditing(tier.id) && (
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="h-4 w-4 text-gray-500" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};