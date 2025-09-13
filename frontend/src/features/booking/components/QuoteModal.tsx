import React, { useState } from 'react';
import { X, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/shared/ui';

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
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (!isOpen || !tier) {
    return null;
  }

  const toggleFeature = (feature: string) => {
    setExpandedFeature(expandedFeature === feature ? null : feature);
  };

  const closeModal = () => {
    setExpandedFeature(null);
    onClose();
  };

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
          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              ${tier.price}
            </div>
            {tier.originalPrice && tier.originalPrice > tier.price && (
              <div className="text-lg text-gray-400 line-through">
                ${tier.originalPrice}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-stone-300 text-center">{tier.description}</p>
          </div>

          {/* Features */}
          {tier.features && tier.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">What's Included:</h3>
              <div className="space-y-2">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-stone-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {tier.additionalDetails && tier.additionalDetails.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Details:</h3>
              <div className="space-y-3">
                {tier.additionalDetails.map((detail, index) => (
                  <div key={index} className="border border-stone-600 rounded-lg p-4">
                    <button
                      onClick={() => toggleFeature(detail.title)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-white">{detail.title}</span>
                      {expandedFeature === detail.title ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFeature === detail.title && (
                      <div className="mt-3 text-stone-300">
                        {detail.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
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