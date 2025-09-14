/**
 * Service feature types for handling explicit tier structures
 */

export interface TierFeatureGroup {
  tierName: string;
  services: string[];
}

export interface ServiceFeature {
  id: string;
  name: string;
  type: 'service' | 'tier';
  children?: ServiceFeature[]; // For tier references
}

export interface TierFeature {
  id: string;
  name: string;
  type: 'service' | 'tier';
  children?: ServiceFeature[];
}

export interface ExpandedTier {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: TierFeatureGroup[];
  enabled: boolean;
  popular?: boolean;
}

/**
 * Utility functions for handling explicit tier structures
 */

/**
 * Convert old string array format to new TierFeatureGroup format
 */
export const convertToTierFeatureGroups = (
  features: string[],
  tiers: Array<{ id: string; name: string; features: TierFeatureGroup[] }>
): TierFeatureGroup[] => {
  // For now, just create a single group with the current tier's services
  // This will be expanded when we add tier references
  return [{
    tierName: "Current Tier", // This will be replaced with actual tier name
    services: features
  }];
};

/**
 * Expand tier features for display - converts TierFeatureGroup[] to ServiceFeature[]
 */
export const expandTierFeatures = (
  featureGroups: TierFeatureGroup[],
  serviceOptions: Array<{ id: string; name: string }>
): ServiceFeature[] => {
  if (!featureGroups || !Array.isArray(featureGroups)) {
    return [];
  }
  
  // If only one group (Tier 1), show flat features
  if (featureGroups.length === 1) {
    const group = featureGroups[0];
    return (group.services || []).map(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return {
        id: serviceId,
        name: service?.name || serviceId,
        type: 'service' as const
      };
    });
  }
  
  // Multiple groups (Tier 2+), show dropdowns for previous tiers + flat for current
  return featureGroups.map((group, index) => {
    const isLastGroup = index === featureGroups.length - 1;
    
    if (isLastGroup) {
      // Current tier - show flat features
      return (group.services || []).map(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        return {
          id: serviceId,
          name: service?.name || serviceId,
          type: 'service' as const
        };
      });
    } else {
      // Previous tier - show as dropdown
      const children = (group.services || []).map(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        return {
          id: serviceId,
          name: service?.name || serviceId,
          type: 'service' as const
        };
      });

      return {
        id: `tier-group-${group.tierName}`,
        name: group.tierName,
        type: 'tier',
        children
      };
    }
  }).flat();
};

/**
 * Resolve service names from service IDs
 */
export const resolveServiceNames = (
  features: ServiceFeature[],
  serviceOptions: Array<{ id: string; name: string }>
): ServiceFeature[] => {
  return features.map(feature => {
    if (feature.type === 'service') {
      const service = serviceOptions.find(s => s.id === feature.id);
      return {
        ...feature,
        name: service?.name || feature.name
      };
    } else if (feature.type === 'tier' && feature.children) {
      return {
        ...feature,
        children: resolveServiceNames(feature.children, serviceOptions)
      };
    }
    return feature;
  });
};

/**
 * Remove a service from a specific tier group
 */
export const removeServiceFromTierGroup = (
  tiers: Array<{ id: string; name: string; features: TierFeatureGroup[] }>,
  tierId: string,
  groupTierName: string,
  serviceId: string
): Array<{ id: string; name: string; features: TierFeatureGroup[] }> => {
  return tiers.map(tier => {
    if (tier.id === tierId) {
      return {
        ...tier,
        features: tier.features.map(group => {
          if (group.tierName === groupTierName) {
            return {
              ...group,
              services: group.services.filter(s => s !== serviceId)
            };
          }
          return group;
        })
      };
    }
    return tier;
  });
};

/**
 * Add a tier reference to a tier's features
 */
export const addTierReference = (
  tiers: Array<{ id: string; name: string; features: TierFeatureGroup[] }>,
  tierId: string,
  referencedTierName: string,
  referencedTierServices: string[]
): Array<{ id: string; name: string; features: TierFeatureGroup[] }> => {
  return tiers.map(tier => {
    if (tier.id === tierId) {
      return {
        ...tier,
        features: [
          ...tier.features,
          {
            tierName: referencedTierName,
            services: referencedTierServices
          }
        ]
      };
    }
    return tier;
  });
};

/**
 * Convert old string array format to new TierFeatureGroup format
 */
export const convertStringArrayToTierFeatureGroups = (
  features: string[],
  tierName: string
): TierFeatureGroup[] => {
  return [{
    tierName: tierName,
    services: features
  }];
};

/**
 * Convert new TierFeatureGroup format back to string array for backend
 */
export const convertTierFeatureGroupsToStringArray = (
  featureGroups: TierFeatureGroup[]
): string[] => {
  // Flatten all services from all groups into a single array
  return featureGroups.flatMap(group => group.services);
};

/**
 * Convert old tier structure to new tier structure
 */
export const convertTierToNewFormat = (
  tier: { id: string; name: string; price: number; duration: number; features: string[]; enabled: boolean; popular?: boolean }
): { id: string; name: string; price: number; duration: number; features: TierFeatureGroup[]; enabled: boolean; popular?: boolean } => {
  return {
    ...tier,
    features: convertStringArrayToTierFeatureGroups(tier.features, tier.name)
  };
};

/**
 * Convert new tier structure back to old format for backend
 */
export const convertTierToOldFormat = (
  tier: { id: string; name: string; price: number; duration: number; features: TierFeatureGroup[]; enabled: boolean; popular?: boolean }
): { id: string; name: string; price: number; duration: number; features: string[]; enabled: boolean; popular?: boolean } => {
  return {
    ...tier,
    features: convertTierFeatureGroupsToStringArray(tier.features)
  };
};

/**
 * Build proper tier structure for display based on tier position
 */
export const buildTierDisplayStructure = (
  tier: { id: string; name: string; features: string[] },
  allTiers: Array<{ id: string; name: string; features: string[] }>,
  serviceOptions: Array<{ id: string; name: string }>
): ServiceFeature[] => {
  // Always show only the current tier's actual features as flat bullet points
  // No dropdowns or references to previous tiers in the display
  return tier.features.map(serviceId => {
    const service = serviceOptions.find(s => s.id === serviceId);
    return {
      id: serviceId,
      name: service?.name || serviceId,
      type: 'service' as const
    };
  });
};

/**
 * Build tier structure for editing modal with dropdowns for previous tiers
 */
export const buildTierEditStructure = (
  tier: { id: string; name: string; features: string[] },
  allTiers: Array<{ id: string; name: string; features: string[] }>,
  serviceOptions: Array<{ id: string; name: string }>
): ServiceFeature[] => {
  // Find the tier's position in the list
  const tierIndex = allTiers.findIndex(t => t.id === tier.id);
  
  if (tierIndex === 0) {
    // Tier 1 - show flat features
    return tier.features.map(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return {
        id: serviceId,
        name: service?.name || serviceId,
        type: 'service' as const
      };
    });
  } else {
    // Tier 2+ - show previous tiers as dropdowns + current tier as flat
    const result: ServiceFeature[] = [];
    
    // Add previous tiers as dropdowns (only show features that are NOT in current tier)
    for (let i = 0; i < tierIndex; i++) {
      const prevTier = allTiers[i];
      const featuresNotInCurrentTier = prevTier.features.filter(feature => !tier.features.includes(feature));
      
      if (featuresNotInCurrentTier.length > 0) {
        const children = featuresNotInCurrentTier.map(serviceId => {
          const service = serviceOptions.find(s => s.id === serviceId);
          return {
            id: serviceId,
            name: service?.name || serviceId,
            type: 'service' as const
          };
        });
        
        result.push({
          id: `tier-group-${prevTier.name}`,
          name: prevTier.name,
          type: 'tier',
          children
        });
      }
    }
    
    // Add current tier features as flat
    const currentTierFeatures = tier.features.map(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return {
        id: serviceId,
        name: service?.name || serviceId,
        type: 'service' as const
      };
    });
    
    result.push(...currentTierFeatures);
    return result;
  }
};
