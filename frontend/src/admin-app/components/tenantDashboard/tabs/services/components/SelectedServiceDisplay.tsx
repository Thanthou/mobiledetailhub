/**
 * Display component for showing selected service details and tiers
 */

import React from 'react';

import type { Service } from '../types';
import { buildTierDisplayStructure, resolveServiceNames } from '../types/ServiceFeature';
import { FeatureList } from './FeatureList';

interface SelectedServiceDisplayProps {
  service: Service;
  availableFeatures: Array<{ id: string; name: string }>;
  onRemoveFeature: (serviceId: string, currentTierId: string, groupTierName: string) => void;
}

export const SelectedServiceDisplay: React.FC<SelectedServiceDisplayProps> = ({
  service,
  availableFeatures,
  onRemoveFeature
}) => {
  return (
    <div className="bg-stone-800 rounded-lg border border-stone-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Selected Service: {service.name}</h3>
      
      {service.tiers.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-2">
            {service.tiers.length} tier{service.tiers.length !== 1 ? 's' : ''} configured:
          </div>
          <div className="space-y-4">
            {service.tiers.map((tier, index) => (
              <div key={tier.id} className="bg-stone-700 rounded-lg p-4 border border-stone-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{tier.name}</h4>
                  <span className="text-xs text-gray-400">Tier {index + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">
                    ${(tier.priceCents / 100).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tier.durationMinutes} minutes
                  </div>
                  {tier.features.length > 0 && (
                    <div className="text-sm text-gray-300">
                      <div className="font-medium mb-2">Features:</div>
                      <FeatureList 
                        features={resolveServiceNames(
                          buildTierDisplayStructure(tier, service.tiers || [], availableFeatures),
                          availableFeatures
                        )}
                        tierNames={service.tiers?.map(t => t.name) || []}
                        onRemoveFeature={onRemoveFeature}
                        showRemoveButtons={true}
                        currentTierId={`tier-${tier.id}`}
                        allTiers={service.tiers || []}
                      />
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    {tier.enabled && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Enabled
                      </span>
                    )}
                    {tier.popular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-400">No tiers configured for this service.</div>
      )}
    </div>
  );
};

