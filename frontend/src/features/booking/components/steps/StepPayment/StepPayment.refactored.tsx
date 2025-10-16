import React from 'react';

import { usePaymentData, usePaymentForm } from '@/features/booking/hooks';
import { useBookingPayment } from '@/features/booking/state';

import { PaymentOption } from '../../payment/PaymentOption';
import { PaymentSummary, PaymentTabs, SummarySection, VehicleSection } from './components';

interface StepPaymentProps {
  onPaymentComplete?: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({ onPaymentComplete }) => {
  // Use custom hooks for data and form state
  const paymentData = usePaymentData();
  const paymentForm = usePaymentForm();
  const { setPaymentMethod: setStorePaymentMethod } = useBookingPayment();

  const handlePaymentMethodSelect = (method: string) => {
    paymentForm.setPaymentMethod(method);
    setStorePaymentMethod(method);
  };

  const handleCompleteBooking = () => {
    onPaymentComplete?.();
  };

  const isFormValid = () => {
    if (paymentForm.paymentMethod === 'card') {
      const { cardDetails } = paymentForm;
      return cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvv && 
             cardDetails.name && cardDetails.email && cardDetails.phone && 
             cardDetails.address && cardDetails.city && cardDetails.state && cardDetails.zip;
    }
    return paymentForm.paymentMethod !== '';
  };

  if (paymentData.serviceTiersLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-300 mb-8">Loading payment options...</p>
        <div className="animate-pulse bg-gray-700 h-32 rounded-lg max-w-2xl mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Complete Your Booking</h2>
        <p className="text-gray-300">Review your order and choose your payment method</p>
      </div>

      {/* Payment Tabs */}
      <PaymentTabs 
        activeTab={paymentForm.activeTab} 
        onTabChange={paymentForm.setActiveTab} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {paymentForm.activeTab === 'vehicle' && (
            <VehicleSection bookingData={paymentData.bookingData} />
          )}
          
          {paymentForm.activeTab === 'location' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Service Location</h3>
              <p className="text-gray-300">
                {paymentData.bookingData.location}
              </p>
            </div>
          )}
          
          {paymentForm.activeTab === 'summary' && (
            <SummarySection 
              selectedService={paymentData.selectedService}
              selectedAddons={paymentData.selectedAddons}
            />
          )}
          
          {paymentForm.activeTab === 'payment' && (
            <div className="space-y-6">
              <PaymentOption
                selectedMethod={paymentForm.paymentMethod}
                onMethodSelect={handlePaymentMethodSelect}
                cardDetails={paymentForm.cardDetails}
                onCardInputChange={paymentForm.updateCardDetails}
                expandedSections={paymentForm.expandedSections}
                onToggleSection={paymentForm.toggleSection}
              />
              
              <div className="flex justify-end">
                <button
                  onClick={handleCompleteBooking}
                  disabled={!isFormValid()}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                    isFormValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Booking - ${paymentData.total.toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <PaymentSummary
            servicePrice={paymentData.servicePrice}
            addonsPrice={paymentData.addonsPrice}
            subtotal={paymentData.subtotal}
            tax={paymentData.tax}
            total={paymentData.total}
            selectedService={paymentData.selectedService}
            selectedAddons={paymentData.selectedAddons}
          />
        </div>
      </div>
    </div>
  );
};

export default StepPayment;
