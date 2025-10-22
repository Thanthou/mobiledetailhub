/**
 * BookingForm - Example component demonstrating async hook pattern
 * Shows how to use the new async hooks with Zustand stores
 */

import React, { useCallback } from 'react';

import { useAnalytics } from '@shared/hooks/useAnalytics';

import { useBookingAsync } from '../hooks/useBookingAsync';
import { useBookingPersistence } from '../hooks/useBookingAsync';
import { useBookingStore } from '../state/bookingStore';

interface BookingFormProps {
  onSuccess?: (bookingId: string) => void;
  onError?: (error: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onError }) => {
  // Get store state and actions
  const { bookingData, updateBookingData, setErrors } = useBookingStore();
  
  // Get async operations
  const {
    isSubmitting,
    submissionError,
    validateBooking,
    submitBooking,
    saveBookingDraft,
    hasUnsavedChanges
  } = useBookingAsync();

  // Get persistence features
  const { autoSaveEnabled } = useBookingPersistence();

  // Analytics
  const { logEvent } = useAnalytics();

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate booking data
      const validation = validateBooking(bookingData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Submit booking
      const result = await submitBooking(bookingData);
      
      if (result.success && result.bookingId) {
        logEvent('booking_completed', {
          booking_id: result.bookingId,
          vehicle: bookingData.vehicle || 'unknown',
          city: bookingData.location.city || '',
          revenue: Number(result.amount || 0),
        });
        onSuccess?.(result.bookingId);
      } else {
        onError?.(result.error || 'Submission failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      onError?.(errorMessage);
    }
  }, [bookingData, validateBooking, submitBooking, setErrors, onSuccess, onError, logEvent]);

  // Handle auto-save
  const handleAutoSave = useCallback(async () => {
    if (hasUnsavedChanges(bookingData)) {
      await saveBookingDraft(bookingData);
    }
  }, [bookingData, hasUnsavedChanges, saveBookingDraft]);

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: string) => {
    updateBookingData({ [field]: value });
  }, [updateBookingData]);

  return (
    <div className="space-y-6">
      {/* Auto-save indicator */}
      {autoSaveEnabled && (
        <div className="text-sm text-gray-500">
          Auto-save enabled
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
        {/* Vehicle Selection */}
        <div>
          <label htmlFor="vehicle" className="block text-sm font-medium text-white mb-2">
            Vehicle Type
          </label>
          <select
            id="vehicle"
            value={bookingData.vehicle}
            onChange={(e) => { 
              handleInputChange('vehicle', e.target.value); 
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="truck">Truck</option>
            <option value="suv">SUV</option>
            <option value="boat">Boat</option>
            <option value="rv">RV</option>
          </select>
        </div>

        {/* Vehicle Details */}
        {bookingData.vehicle && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-white mb-2">
                Make
              </label>
              <input
                type="text"
                id="make"
                value={bookingData.vehicleDetails.make}
                onChange={(e) => { 
                  handleInputChange('vehicleDetails', { ...bookingData.vehicleDetails, make: e.target.value }); 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Toyota"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-white mb-2">
                Model
              </label>
              <input
                type="text"
                id="model"
                value={bookingData.vehicleDetails.model}
                onChange={(e) => { 
                  handleInputChange('vehicleDetails', { ...bookingData.vehicleDetails, model: e.target.value }); 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Camry"
              />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-white mb-2">
                Year
              </label>
              <input
                type="text"
                id="year"
                value={bookingData.vehicleDetails.year}
                onChange={(e) => { 
                  handleInputChange('vehicleDetails', { ...bookingData.vehicleDetails, year: e.target.value }); 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2020"
              />
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
            Service Address
          </label>
          <input
            type="text"
            id="address"
            value={bookingData.location.address}
            onChange={(e) => { 
              handleInputChange('location', { ...bookingData.location, address: e.target.value }); 
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service address"
          />
        </div>

        {/* Error Display */}
        {submissionError && (
          <div className="text-red-500 text-sm">
            {submissionError}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>

      {/* Auto-save trigger */}
      <button
        onClick={() => { void handleAutoSave(); }}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Save Draft
      </button>
    </div>
  );
};

export default BookingForm;
