import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/shared/ui';
import { getServiceDisplayNames, getServiceFeatures, getServiceDescription, getServiceExplanation } from '../utils/serviceNameMapping';

import type { ServiceTier } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: ServiceTier | null;
  onSelectTier: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  tier,
  onSelectTier,
}) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  if (!isOpen || !tier) {
    return null;
  }

  const toggleService = (serviceKey: string) => {
    setExpandedService(expandedService === serviceKey ? null : serviceKey);
  };

  const closeModal = () => {
    setExpandedService(null);
    onClose();
  };

  // Get service keys and their display names
  const serviceKeys = tier.features || [];
  const serviceDisplayNames = getServiceDisplayNames(serviceKeys, tier.addonType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-stone-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-700">
          <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Service List */}
          {serviceKeys.length > 0 && (
            <div className="space-y-3">
              {serviceKeys.map((serviceKey, index) => {
                const displayName = serviceDisplayNames[index];
                const features = getServiceFeatures(serviceKey, tier.addonType);
                const description = getServiceDescription(serviceKey, tier.addonType);
                const explanation = getServiceExplanation(serviceKey, tier.addonType);
                const isExpanded = expandedService === serviceKey;

                return (
                  <div key={serviceKey} className="border border-stone-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleService(serviceKey)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-700 transition-colors"
                    >
                      <span className="font-medium text-white text-lg">{displayName}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 bg-stone-700/50">
                        {/* Description */}
                        {description && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Description</h4>
                            <p className="text-stone-300 text-sm">{description}</p>
                          </div>
                        )}
                        
                        {/* Explanation */}
                        {explanation && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">What This Includes</h4>
                            <p className="text-stone-300 text-sm">{explanation}</p>
                          </div>
                        )}
                        
                        {/* Features */}
                        {features.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Features</h4>
                            <ul className="space-y-2">
                              {features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start text-stone-300">
                                  <span className="text-orange-500 mr-2">•</span>
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={closeModal}
              variant="secondary"
              size="md"
              className="flex-1 bg-stone-700 hover:bg-stone-600 py-3 px-6 font-semibold"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onSelectTier();
                closeModal();
              }}
              variant="primary"
              size="md"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3 px-6 font-semibold transform hover:scale-105"
            >
              Choose This Tier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;