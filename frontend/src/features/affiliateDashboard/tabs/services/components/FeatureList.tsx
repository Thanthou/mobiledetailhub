import React, { useState } from 'react';
import { ChevronRight, ChevronDown, X } from 'lucide-react';

import type { ServiceFeature } from '../types/ServiceFeature';

interface FeatureListProps {
  features: ServiceFeature[];
  tierNames: string[];
  onRemoveFeature?: (serviceId: string, tierId: string, groupTierName: string) => void;
  showRemoveButtons?: boolean;
  currentTierId?: string;
  allTiers?: Array<{ id: string; name: string; features: string[] }>;
}

export const FeatureList: React.FC<FeatureListProps> = ({ 
  features, 
  tierNames, 
  onRemoveFeature, 
  showRemoveButtons = false,
  currentTierId,
  allTiers = []
}) => {
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

  // Find which tier a feature originally belongs to
  const findFeatureOriginalTier = (serviceId: string): string | null => {
    for (const tier of allTiers) {
      if (tier.features.includes(serviceId)) {
        return tier.id;
      }
    }
    return null;
  };

  const toggleTier = (tierId: string) => {
    setExpandedTiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tierId)) {
        newSet.delete(tierId);
      } else {
        newSet.add(tierId);
      }
      return newSet;
    });
  };

  const renderFeature = (feature: ServiceFeature, depth = 0, groupTierName?: string) => {
    const isExpanded = expandedTiers.has(feature.id);
    const isTier = feature.type === 'tier';
    const hasChildren = feature.children && feature.children.length > 0;

    return (
      <div key={feature.id} className="ml-2">
        <div className="flex items-center gap-2 py-1 group">
          {isTier && hasChildren && (
            <button
              onClick={() => toggleTier(feature.id)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!isTier && <div className="w-3" />} {/* Spacer for alignment */}
          
          <span className={`text-sm flex-1 ${isTier ? 'font-medium text-blue-300' : 'text-gray-300'}`}>
            {isTier ? '📦 ' : '• '}{feature.name}
          </span>
          
          {showRemoveButtons && !isTier && onRemoveFeature && currentTierId && (
            <button
              onClick={() => onRemoveFeature(feature.id, currentTierId, groupTierName || '')}
              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 p-1"
              title="Remove feature"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {isTier && hasChildren && isExpanded && (
          <div className="ml-4">
            {feature.children?.map(child => renderFeature(child, depth + 1, feature.name))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {features.map(feature => renderFeature(feature))}
    </div>
  );
};
