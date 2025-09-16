import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { generateFeatureDetails } from '../../../utils/displayUtils';

interface AddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  featureIds: string[];
  popular?: boolean;
}

interface AddonDetailsModalProps {
  addon: AddonItem;
  isOpen: boolean;
  onClose: () => void;
  vehicleType: string;
  category: string;
}

const AddonDetailsModal: React.FC<AddonDetailsModalProps> = ({
  addon,
  isOpen,
  onClose,
  vehicleType,
  category
}) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [featuresData, setFeaturesData] = useState<any>(null);

  // Load features data based on vehicle type and category
  useEffect(() => {
    if (isOpen && vehicleType && category) {
      loadFeaturesForVehicleAndCategory(vehicleType, category);
    }
  }, [isOpen, vehicleType, category]);

  const loadFeaturesForVehicleAndCategory = async (vehicleType: string, category: string) => {
    try {
      const vehicleFolderMap: Record<string, string> = {
        'car': 'cars',
        'truck': 'trucks',
        'suv': 'suvs',
        'boat': 'boats',
        'rv': 'rvs'
      };

      const folderName = vehicleFolderMap[vehicleType];
      if (folderName) {
        const featuresData = await import(`@/data/affiliate-services/${folderName}/addons/${category}/features.json`);
        setFeaturesData(featuresData.default);
      }
    } catch (error) {
      console.error(`❌ Error loading features for ${vehicleType}/${category}:`, error);
    }
  };

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
    return generateFeatureDetails(featureId, featuresData); // Use shared utility
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-stone-700 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{addon.name}</h2>
          <p className="text-4xl font-bold text-orange-500">
            ${addon.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <p className="text-stone-300 text-lg">{addon.description}</p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">What's Included:</h3>
            {addon.featureIds.map((featureId) => {
              const featureDetails = getFeatureDetails(featureId);
              const isExpanded = expandedFeatures.has(featureId);

              return (
                <div key={featureId} className="border border-stone-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFeature(featureId)}
                    className="flex justify-between items-center w-full p-4 text-left text-white font-medium hover:bg-stone-800 transition-colors"
                  >
                    <span>{featureDetails?.name || featureId}</span>
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

export default AddonDetailsModal;
