/**
 * Utility functions for generating display content for services and addons
 */

interface FeatureData {
  [key: string]: {
    name: string;
    description: string;
    explanation: string;
    image: string;
    duration: number;
    features: string[];
  };
}

interface ServiceData {
  description?: string;
  [key: string]: unknown;
}

/**
 * Get description from service/addon data, with fallback to feature names
 */
export const getCardDescription = (
  serviceData: ServiceData,
  featureKeys: string[], 
  featuresData: FeatureData,
  maxFeatures: number = 3
): string => {
  // First priority: use description field from service/addon data
  if (serviceData.description) {
    return serviceData.description;
  }

  // Fallback: generate from feature names
  if (featureKeys.length === 0) {
    return 'No features available';
  }

  // Look up feature names from features.json using the keywords
  const featureNames = featureKeys.map(featureKey => {
    const feature = featuresData[featureKey];
    return feature ? feature.name : featureKey; // Fallback to key if not found
  });
  
  // If we have too many features, show only the first few and add "..."
  if (featureNames.length > maxFeatures) {
    return featureNames.slice(0, maxFeatures).join(', ') + '...';
  }
  
  return featureNames.join(', ');
};

/**
 * Generate feature details for modal display
 */
export const generateFeatureDetails = (
  featureKey: string,
  featuresData: FeatureData
) => {
  return featuresData[featureKey] || null;
};

/**
 * Get all feature details for a list of feature keys
 */
export const getAllFeatureDetails = (
  featureKeys: string[],
  featuresData: FeatureData
) => {
  return featureKeys.map(key => ({
    key,
    details: generateFeatureDetails(key, featuresData)
  }));
};

/**
 * Format price for display
 * @deprecated Use formatPrice from @/shared/utils instead
 */
export { formatPrice } from '@shared/utils';
