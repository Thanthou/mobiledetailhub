import React from 'react';
import { Plus } from 'lucide-react';

import type { BookingData } from '@/tenant-app/components/booking/state';

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface ServiceTier {
  id: string;
  name: string;
  price: number;
}

interface SummarySectionProps {
  bookingData: BookingData;
  serviceTiers: ServiceTier[];
  allAvailableAddons: Addon[];
  totals: {
    servicePrice: number;
    addonPrice: number;
    total: number;
  };
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  bookingData,
  serviceTiers,
  allAvailableAddons,
  totals
}) => {
  const { serviceTier, addons, schedule } = bookingData;
  const { servicePrice, total } = totals;
  
  // Find the selected service for display name
  const selectedService = Array.isArray(serviceTiers) ? serviceTiers.find(service => service.id === serviceTier) : null;
  const serviceInfo = selectedService || { name: 'No Service Selected', price: 0 };
  
  return (
    <div className="space-y-6">
      {/* Service */}
      {serviceTier && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Service</h3>
          <div className="bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{serviceInfo.name}</span>
              <span className="text-2xl font-bold text-orange-400">${servicePrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add-ons */}
      {addons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Add-ons</h3>
          <div className="space-y-3">
            {addons.map((addonId, index) => {
              const addon = allAvailableAddons.find(a => a.id === addonId);
              return (
                <div key={index} className="bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4 text-orange-400" />
                      <span className="text-white/90 text-sm font-medium">{addon ? addon.name : addonId}</span>
                    </div>
                    <span className="text-orange-400 font-semibold">${addon ? addon.price : 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule */}
      {schedule.dates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Schedule</h3>
          <div className="bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50">
            <div className="space-y-2">
              {schedule.dates.map((date, index) => (
                <div key={index} className="text-white font-medium">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              ))}
              {schedule.time && <div className="text-sm text-gray-400">Time: {schedule.time}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="pt-6 border-t border-stone-600/50">
        <div className="bg-orange-500/20 rounded-3xl p-6 border border-orange-400/30">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-white">Total</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-400">${total}</div>
              <div className="text-xs text-gray-400 mt-1">Estimated Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

