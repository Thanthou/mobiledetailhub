import React from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/shared/ui';
import { StepContainer, StepBottomSection } from '../components';

interface BookingPaymentProps {
  averageRating: number;
  totalReviews: number;
  onBack: () => void;
  onBackToHome: () => void;
  // Add props for the selected data
  selectedVehicle?: string;
  selectedService?: string;
  selectedTierForService?: { [serviceId: string]: string };
  selectedTierForAddon?: { [addonId: string]: string };
  availableVehicles?: any[];
  availableServices?: any[];
  availableAddons?: any[];
  vehicleDetails?: {
    make: string;
    model: string;
    year: string;
    color: string;
    length: string;
  };
}

const BookingPayment: React.FC<BookingPaymentProps> = ({
  averageRating,
  totalReviews,
  onBack,
  onBackToHome,
  selectedVehicle,
  selectedService,
  selectedTierForService,
  selectedTierForAddon,
  availableVehicles,
  availableServices,
  availableAddons,
  vehicleDetails,
}) => {
  return (
    <StepContainer>
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Main Content */}
        <div className="flex flex-col justify-center" style={{ height: 'calc(100vh - 200px)' }}>
          <div>
            {/* Booking Summary */}
            <div className="bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Booking Summary</h3>
              
              <div className="space-y-6">
                {/* Step 1: Vehicle Selection */}
                <div className="border-b border-stone-700 pb-4">
                  <h4 className="text-lg font-semibold text-orange-500 mb-2">1. Vehicle</h4>
                  {selectedVehicle && vehicleDetails ? (
                    <div className="space-y-1">
                      <p className="text-stone-300">
                        <span className="font-medium">Make:</span> {vehicleDetails.make || 'Not specified'}
                      </p>
                      <p className="text-stone-300">
                        <span className="font-medium">Model:</span> {vehicleDetails.model || 'Not specified'}
                      </p>
                      <p className="text-stone-300">
                        <span className="font-medium">Year:</span> {vehicleDetails.year || 'Not specified'}
                      </p>
                      <p className="text-stone-300">
                        <span className="font-medium">Color:</span> {vehicleDetails.color || 'Not specified'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-stone-300">No vehicle selected</p>
                  )}
                </div>

                {/* Service and Addons Summary */}
                <div className="bg-stone-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-orange-500 mb-4 text-center">Service Summary</h4>
                  
                  <div className="space-y-4">
                    {/* Service Section */}
                    <div>
                      <h5 className="text-stone-300 font-medium mb-2">Service:</h5>
                      {selectedService && selectedTierForService?.[selectedService] ? (
                        (() => {
                          const service = availableServices?.find(s => s.id === selectedService);
                          const tierId = selectedTierForService[selectedService];
                          const tier = service?.tiers?.find(t => t.id === tierId);
                          return (
                            <div className="flex justify-between items-center">
                              <span className="text-stone-300">
                                • {tier?.name || service?.name || selectedService}
                              </span>
                              <span className="text-stone-300 font-medium">
                                ${tier?.price ? tier.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                              </span>
                            </div>
                          );
                        })()
                      ) : selectedService ? (
                        <div className="flex justify-between items-center">
                          <span className="text-stone-300">
                            • {availableServices?.find(s => s.id === selectedService)?.name || selectedService}
                          </span>
                          <span className="text-stone-300 font-medium">$0.00</span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-stone-300">• No service selected</span>
                          <span className="text-stone-300 font-medium">$0.00</span>
                        </div>
                      )}
                    </div>

                    {/* Addons Section */}
                    <div>
                      <h5 className="text-stone-300 font-medium mb-2">Addons:</h5>
                      {selectedTierForAddon && Object.keys(selectedTierForAddon).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(selectedTierForAddon).map(([addonId, tierId], index) => {
                            // Find the addon and tier
                            const addon = availableAddons?.find(a => a.id === addonId);
                            const tier = addon?.tiers?.find(t => t.id === tierId);
                            
                            return (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-stone-300">
                                  • {tier?.name || addon?.name || tierId}
                                </span>
                                <span className="text-stone-300 font-medium">
                                  ${tier?.price ? tier.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-stone-300">• No addons selected</span>
                          <span className="text-stone-300 font-medium">$0.00</span>
                        </div>
                      )}
                    </div>

                    {/* Total Line */}
                    <div className="border-t border-stone-600 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold text-lg">Total</span>
                        <span className="text-white font-semibold text-lg">
                          ${(() => {
                            let total = 0;
                            
                            // Add service price
                            if (selectedService && selectedTierForService?.[selectedService]) {
                              const service = availableServices?.find(s => s.id === selectedService);
                              const tierId = selectedTierForService[selectedService];
                              const tier = service?.tiers?.find(t => t.id === tierId);
                              if (tier?.price) {
                                total += tier.price;
                              }
                            }
                            
                            // Add addon prices
                            if (selectedTierForAddon && Object.keys(selectedTierForAddon).length > 0) {
                              Object.entries(selectedTierForAddon).forEach(([addonId, tierId]) => {
                                const addon = availableAddons?.find(a => a.id === addonId);
                                const tier = addon?.tiers?.find(t => t.id === tierId);
                                if (tier?.price) {
                                  total += tier.price;
                                }
                              });
                            }
                            
                            return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="-mt-52 pb-4">
          <StepBottomSection
            onBack={onBack}
            onNext={() => {
              // TODO: Implement payment processing logic
              console.log('Payment processed!');
            }}
            showBack={true}
            showNext={true}
            nextText="Complete Payment"
            averageRating={averageRating}
            totalReviews={totalReviews}
            currentStep={5}
            totalSteps={5}
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default BookingPayment;