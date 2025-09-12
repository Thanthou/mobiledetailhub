import React from 'react';
import { CheckCircle, Edit3 } from 'lucide-react';

import { Button } from '@/shared/ui';

import type { ScheduleSelection,ServiceSelection, VehicleSelection } from '../schemas/booking.schemas';

interface StepReviewProps {
  onNext: () => void;
  onPrevious: () => void;
  onEditStep: (step: string) => void;
  vehicleData: VehicleSelection;
  serviceData: ServiceSelection;
  scheduleData: ScheduleSelection;
  services: Array<{
    id: string;
    name: string;
    base_price_cents: string;
    duration: number;
  }>;
}

const StepReview: React.FC<StepReviewProps> = ({
  onNext,
  onPrevious,
  onEditStep,
  vehicleData,
  serviceData,
  scheduleData,
  services
}) => {
  const formatPrice = (priceCents: string) => {
    const price = parseInt(priceCents) / 100;
    return `$${price.toFixed(0)}`;
  };

  const calculateTotal = () => {
    return serviceData.services.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service ? parseInt(service.base_price_cents) : 0);
    }, 0);
  };

  const totalPrice = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Review Your Booking</h2>
      
      {/* Vehicle Information */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Vehicle Information</h3>
          <button
            onClick={() => { onEditStep('vehicle'); }}
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="text-gray-300 space-y-1">
          <p><strong>Type:</strong> {vehicleData.type}</p>
          <p><strong>Make:</strong> {vehicleData.make}</p>
          <p><strong>Model:</strong> {vehicleData.model}</p>
          <p><strong>Year:</strong> {vehicleData.year}</p>
        </div>
      </div>

      {/* Services Information */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Selected Services</h3>
          <button
            onClick={() => { onEditStep('services'); }}
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="space-y-2">
          {serviceData.services.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            return service ? (
              <div key={serviceId} className="flex justify-between items-center">
                <span className="text-gray-300">{service.name}</span>
                <span className="text-white font-semibold">
                  {formatPrice(service.base_price_cents)}
                </span>
              </div>
            ) : null;
          })}
          {serviceData.addons && serviceData.addons.length > 0 && (
            <div className="border-t border-gray-600 pt-2 mt-2">
              <p className="text-gray-400 text-sm mb-1">Add-ons:</p>
              {serviceData.addons.map(addon => (
                <div key={addon} className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{addon}</span>
                  <span className="text-white font-semibold text-sm">+$50</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Information */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Schedule</h3>
          <button
            onClick={() => { onEditStep('schedule'); }}
            className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
        <div className="text-gray-300 space-y-1">
          <p>
            <strong>Date:</strong> {new Date(scheduleData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p><strong>Time:</strong> {scheduleData.time}</p>
          <p><strong>Duration:</strong> {scheduleData.duration} hour{scheduleData.duration > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-6 p-4 bg-orange-400/10 border border-orange-400/20 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total Price</span>
          <span className="text-2xl font-bold text-orange-400">
            {formatPrice(totalPrice.toString())}
          </span>
        </div>
        <p className="text-gray-300 text-sm mt-1">
          * Final price may vary based on vehicle condition and additional services needed
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-white font-semibold mb-2">Terms & Conditions</h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Service will be performed at the scheduled time and location</li>
          <li>• Payment is due upon completion of service</li>
          <li>• Cancellation must be made 24 hours in advance</li>
          <li>• Weather conditions may affect outdoor services</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={onPrevious}
          variant="secondary"
          size="md"
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          variant="primary"
          size="md"
          className="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg"
          leftIcon={<CheckCircle className="w-4 h-4" />}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default StepReview;
