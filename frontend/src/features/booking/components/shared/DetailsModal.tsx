import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { generateFeatureDetails } from '../../utils/displayUtils';
import { useFeaturesData } from '../../hooks';

interface DetailsItem {
  id: string;
  name: string;
  price: number;
  description: string;
  featureIds: string[];
  popular?: boolean;
}

interface DetailsModalProps {
  item: DetailsItem;
  isOpen: boolean;
  onClose: () => void;
  vehicleType: string;
  category?: string; // Optional for service modals
  itemType: 'service' | 'addon';
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  vehicleType,
  category,
  itemType
}) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const featuresData = useFeaturesData({ isOpen, vehicleType, category, itemType });

  const toggleFeature = (featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const getFeatureDetails = (featureId: string) => {
    return generateFeatureDetails(featureId, featuresData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-stone-900 border-b border-stone-700 p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{item.name}</h2>
              <p className="text-4xl font-bold text-orange-500">
                ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-stone-300 text-lg">{item.description}</p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">What's Included:</h3>
            {item.featureIds.map((featureId) => {
              const featureDetails = getFeatureDetails(featureId);
              const isExpanded = expandedFeatures.has(featureId);
              
              return (
                <div key={featureId} className="border border-stone-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFeature(featureId)}
                    className="w-full p-4 text-left bg-stone-800 hover:bg-stone-700 transition-colors flex justify-between items-center"
                  >
                    <span className="text-white font-medium">
                      {featureDetails?.name || featureId}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-stone-400" />
                    )}
                  </button>
                  
                  {isExpanded && featureDetails && (
                    <div className="p-4 bg-stone-850 border-t border-stone-700 space-y-4">
                      {/* Description */}
                      {featureDetails.description && (
                        <div>
                          <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2">
                            Description:
                          </h4>
                          <p className="text-stone-300 text-sm">
                            {featureDetails.description}
                          </p>
                        </div>
                      )}
                      
                      {/* Process/Explanation */}
                      {featureDetails.explanation && (
                        <div>
                          <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2">
                            Process:
                          </h4>
                          <p className="text-stone-300 text-sm">
                            {featureDetails.explanation}
                          </p>
                        </div>
                      )}
                      
                      {/* Features */}
                      {featureDetails.features && featureDetails.features.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-2">
                            Features:
                          </h4>
                          <ul className="space-y-1">
                            {featureDetails.features.map((feature: string, index: number) => (
                              <li key={index} className="text-sm text-stone-300 flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Duration (if available) */}
                      {featureDetails.duration && (
                        <div className="pt-3 border-t border-stone-700">
                          <span className="text-sm text-orange-400 font-medium">
                            Estimated Duration: {featureDetails.duration} minutes
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
