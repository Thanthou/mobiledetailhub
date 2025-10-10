import React, { useState } from 'react';
import { Car, ChevronDown, ChevronUp, CreditCard, FileText, MapPin } from 'lucide-react';

import { useAddons, usePaymentMethods, useServiceTiers } from '@/features/booking/hooks';
import { useBookingAddons, useBookingData, useBookingPayment, useBookingService } from '@/features/booking/state';

import { PaymentOption } from '../../payment/PaymentOption';
import { SummarySection, VehicleSection } from './components';

interface StepPaymentProps {
  onPaymentComplete?: () => void;
}

const StepPayment: React.FC<StepPaymentProps> = ({ onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [activeTab, setActiveTab] = useState<'vehicle' | 'location' | 'summary' | 'payment'>('vehicle');
  const [expandedSections, setExpandedSections] = useState({
    cardInfo: false,
    contactInfo: false,
    billingAddress: false
  });

  // Get booking data from narrow selectors
  const { bookingData } = useBookingData();
  const { setPaymentMethod: setStorePaymentMethod } = useBookingPayment();
  
  // Get service and addon data from the store
  const { serviceTier } = useBookingService();
  const { addons } = useBookingAddons();
  
  // Load service tiers to get actual service data
  const { serviceTiers, isLoading: serviceTiersLoading } = useServiceTiers(bookingData.vehicle || '');
  
  // Load addon data from all categories to calculate prices
  const { availableAddons: windowsAddons } = useAddons(bookingData.vehicle || '', 'windows');
  const { availableAddons: wheelsAddons } = useAddons(bookingData.vehicle || '', 'wheels');
  const { availableAddons: trimAddons } = useAddons(bookingData.vehicle || '', 'trim');
  const { availableAddons: engineAddons } = useAddons(bookingData.vehicle || '', 'engine');
  
  // Combine all addons from different categories
  const allAvailableAddons = [...windowsAddons, ...wheelsAddons, ...trimAddons, ...engineAddons];

  // Calculate totals once - reused in both summary and payment
  const calculateTotals = () => {
    // Find the selected service
    const selectedService = Array.isArray(serviceTiers) ? serviceTiers.find(service => service.id === serviceTier) : null;
    const serviceInfo = selectedService || { name: 'No Service Selected', price: 0 };
    const servicePrice = serviceInfo.price || 0;
    
    // Calculate addon prices
    const addonPrice = addons.reduce((total, addonId) => {
      const addon = allAvailableAddons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    
    return {
      servicePrice,
      addonPrice,
      total: servicePrice + addonPrice
    };
  };

  const totals = calculateTotals();
  
  // Load payment methods (using mock affiliate ID for now)
  const { error } = usePaymentMethods('mock-affiliate');

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setStorePaymentMethod(method);
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      if (prev[section]) {
        return {
          cardInfo: false,
          contactInfo: false,
          billingAddress: false
        };
      }
      return {
        cardInfo: false,
        contactInfo: false,
        billingAddress: false,
        [section]: true
      };
    });
  };

  const handleCompleteBooking = () => {
    onPaymentComplete?.();
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvv && 
             cardDetails.name && cardDetails.email && cardDetails.phone && 
             cardDetails.address && cardDetails.city && cardDetails.state && cardDetails.zip;
    }
    return paymentMethod !== '';
  };

  if (serviceTiersLoading) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-300 mb-8">Loading payment options...</p>
        <div className="animate-pulse bg-gray-700 h-32 rounded-lg max-w-2xl mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-xl text-red-400 mb-8">Error loading payment methods</p>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-300">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  const renderPaymentType = () => {
    const canApplePay = true;
    const canGooglePay = true;
    const canPayPal = true;

    const paymentOptions = [
      { id: 'card' as const, name: 'Credit/Debit Card', icon: 'card', available: true },
      { id: 'paypal' as const, name: 'PayPal', icon: '/icons/paypal.svg', available: canPayPal },
      { id: 'apple-pay' as const, name: 'Apple Pay', icon: 'apple-pay', available: canApplePay },
      { id: 'google-pay' as const, name: 'Google Pay', icon: 'google-pay', available: canGooglePay }
    ];

    const availableOptions = paymentOptions.filter(option => option.available);

    return (
      <div className="text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-6">Choose Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {availableOptions.map((option) => (
              <PaymentOption
                key={option.id}
                id={option.id}
                label={option.name}
                selected={paymentMethod === option.id}
                onSelect={handlePaymentMethodSelect}
                icon={option.icon}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPayment = () => (
    <div className="text-center">
      <div className="max-w-2xl mx-auto">
        {paymentMethod === 'card' && (
          <div className="mb-8 space-y-4">
            {/* Card Information */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => { toggleSection('cardInfo'); }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Card Information</h4>
                {expandedSections.cardInfo ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
              </button>
              {expandedSections.cardInfo && (
                <div className="px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => { handleCardInputChange('name', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={(e) => { handleCardInputChange('cardNumber', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => { handleCardInputChange('expiryDate', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => { handleCardInputChange('cvv', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => { toggleSection('contactInfo'); }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Contact Information</h4>
                {expandedSections.contactInfo ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
              </button>
              {expandedSections.contactInfo && (
                <div className="px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={cardDetails.email}
                        onChange={(e) => { handleCardInputChange('email', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={cardDetails.phone}
                        onChange={(e) => { handleCardInputChange('phone', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => { toggleSection('billingAddress'); }}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Billing Address</h4>
                {expandedSections.billingAddress ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
              </button>
              {expandedSections.billingAddress && (
                <div className="px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={cardDetails.address}
                        onChange={(e) => { handleCardInputChange('address', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={cardDetails.city}
                        onChange={(e) => { handleCardInputChange('city', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="State"
                        value={cardDetails.state}
                        onChange={(e) => { handleCardInputChange('state', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={cardDetails.zip}
                        onChange={(e) => { handleCardInputChange('zip', e.target.value); }}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {paymentMethod && (
          <div className="mt-6">
            <button
              onClick={handleCompleteBooking}
              disabled={!isFormValid()}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                isFormValid()
                  ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Booking - ${totals.total}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-stone-800/80 backdrop-blur-lg rounded-3xl border border-stone-700/50 shadow-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-stone-700/50">
          <button
            onClick={() => { setActiveTab('vehicle'); }}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'vehicle' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'vehicle' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <Car className="w-5 h-5" />
            </div>
            <span className="font-semibold">Vehicle</span>
          </button>
          <button
            onClick={() => { setActiveTab('location'); }}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'location' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'location' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-semibold">Location</span>
          </button>
          <button
            onClick={() => { setActiveTab('summary'); }}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'summary' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'summary' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold">Summary</span>
          </button>
          <button
            onClick={() => { setActiveTab('payment'); }}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'payment' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'payment' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-semibold">Payment</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'vehicle' && (
            <div className="animate-in fade-in duration-300">
              <VehicleSection bookingData={bookingData} />
            </div>
          )}

          {activeTab === 'location' && (
            <div className="animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">Service Location</h3>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
                    <div>
                      <span className="text-gray-400">Address:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location.address || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">City:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location.city || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">State:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location.state || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">ZIP:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location.zip || 'N/A'}</div>
                    </div>
                    {bookingData.location.notes ? (
                      <div className="md:col-span-3">
                        <span className="text-gray-400">Notes:</span>
                        <div className="text-white font-medium whitespace-pre-wrap">{bookingData.location.notes}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'summary' && (
            <div className="animate-in fade-in duration-300">
              <SummarySection
                bookingData={bookingData}
                serviceTiers={serviceTiers}
                allAvailableAddons={allAvailableAddons}
                totals={totals}
              />
            </div>
          )}
          
          {activeTab === 'payment' && (
            <div className="animate-in fade-in duration-300">
              {renderPaymentType()}
              {paymentMethod && renderPayment()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepPayment;
