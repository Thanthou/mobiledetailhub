import React from 'react';

import type { Service } from '../types';

interface SelectedServiceDetailsDisplayProps {
  currentServiceData: Service | null;
}

export const SelectedServiceDetailsDisplay: React.FC<SelectedServiceDetailsDisplayProps> = ({
  currentServiceData,
}) => {
  if (!currentServiceData) {
    return null;
  }

  return (
    <div className="bg-stone-800 rounded-lg border border-stone-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Selected Service: {currentServiceData.name}
      </h3>
      
      {currentServiceData.tiers.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-400 mb-2">
            {currentServiceData.tiers.length} tier{currentServiceData.tiers.length !== 1 ? 's' : ''} configured:
          </div>
          <div className="space-y-4">
            {currentServiceData.tiers.map((tier, index) => (
              <div key={tier.id} className="bg-stone-700 rounded-lg p-4 border border-stone-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{tier.name}</h4>
                  <span className="text-xs text-gray-400">Tier {index + 1}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-400">
                    ${Number(tier.price).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {tier.duration} minutes
                  </div>
                  {tier.features.length > 0 && (
                    <div className="text-sm text-gray-300">
                      <div className="font-medium mb-2">Features:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-400">{feature}</li>
                        ))}
                      </ul>
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

