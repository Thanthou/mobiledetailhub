import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, CreditCard, Car, FileText, MapPin } from 'lucide-react';
import { usePaymentMethods, useServiceTiers, useAddons } from '@/features/booking/hooks';
import { useBookingPayment, useBookingData, useBookingService, useBookingAddons } from '@/features/booking/state';
import { PaymentOption } from '../../payment/PaymentOption';

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
  const { availableAddons: windowsAddons, isLoading: windowsLoading } = useAddons(bookingData.vehicle || '', 'windows');
  const { availableAddons: wheelsAddons, isLoading: wheelsLoading } = useAddons(bookingData.vehicle || '', 'wheels');
  const { availableAddons: trimAddons, isLoading: trimLoading } = useAddons(bookingData.vehicle || '', 'trim');
  const { availableAddons: engineAddons, isLoading: engineLoading } = useAddons(bookingData.vehicle || '', 'engine');
  
  // Combine all addons from different categories
  const allAvailableAddons = [...(windowsAddons || []), ...(wheelsAddons || []), ...(trimAddons || []), ...(engineAddons || [])];
  const addonsLoading = windowsLoading || wheelsLoading || trimLoading || engineLoading;

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
  const { data: paymentMethods = [], isLoading, error } = usePaymentMethods('mock-affiliate');

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setStorePaymentMethod(method);
    // Payment method selected, form will be shown
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      // If the clicked section is already open, close it
      if (prev[section]) {
        return {
          cardInfo: false,
          contactInfo: false,
          billingAddress: false
        };
      }
      // Otherwise, close all sections and open only the clicked one
      return {
        cardInfo: false,
        contactInfo: false,
        billingAddress: false,
        [section]: true
      };
    });
  };

  const handleCompleteBooking = () => {
    // TODO: Add payment processing logic here
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

  if (isLoading || serviceTiersLoading || addonsLoading) {
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


  const renderVehicle = () => {
    const { vehicle, vehicleDetails } = bookingData;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Vehicle Information</h3>
        </div>
        
        {/* Vehicle Details */}
        {(vehicleDetails?.make || vehicle) && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h4 className="text-xl font-semibold text-white mb-4">Selected Vehicle</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
              <div>
                <span className="text-gray-400">Make:</span>
                <div className="text-white text-lg font-semibold">{vehicleDetails?.make || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-400">Model:</span>
                <div className="text-white text-lg font-semibold">{vehicleDetails?.model || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-400">Year:</span>
                <div className="text-white text-lg font-semibold">{vehicleDetails?.year || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-400">
                  {vehicleDetails?.color ? 'Color:' : 'Length:'}
                </span>
                <div className="text-white text-lg font-semibold">
                  {vehicleDetails?.color ? 
                    vehicleDetails.color.charAt(0).toUpperCase() + vehicleDetails.color.slice(1) : 
                    vehicleDetails?.length || 'N/A'
                  }
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!vehicleDetails?.make && !vehicle && (
          <div className="text-center py-8">
            <p className="text-gray-400">No vehicle information available</p>
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    const { vehicle, vehicleDetails, serviceTier, addons, schedule } = bookingData;
    
    // Use the consolidated totals
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
        {schedule.date && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Schedule</h3>
            <div className="bg-stone-700/50 rounded-2xl p-4 border border-stone-600/50">
              <div className="space-y-2">
                {schedule.date.split(',').map((date, index) => (
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
              <span className="text-2xl font-bold text-white">Total</span>
              <span className="text-4xl font-bold text-orange-400">
                ${total}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentType = () => {
    // Basic capability detection (can be enhanced later)
    const canApplePay = true; // Enable for testing purposes
    const canGooglePay = true; // Enable Google Pay
    const canPayPal = true;

    const paymentOptions = [
      { 
        id: 'card' as const, 
        name: 'Credit/Debit Card', 
        icon: 'card',
        available: true
      },
      { 
        id: 'paypal' as const, 
        name: 'PayPal', 
        icon: '/icons/paypal.svg',
        available: canPayPal
      },
      { 
        id: 'apple-pay' as const, 
        name: 'Apple Pay', 
        icon: 'apple-pay',
        available: canApplePay
      },
      { 
        id: 'google-pay' as const, 
        name: 'Google Pay', 
        icon: 'google-pay',
        available: canGooglePay
      }
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
        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="mb-8 space-y-4">
            {/* Card Information Section */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => toggleSection('cardInfo')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Card Information</h4>
                {expandedSections.cardInfo ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>
              {expandedSections.cardInfo && (
                <div className="px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => toggleSection('contactInfo')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Contact Information</h4>
                {expandedSections.contactInfo ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>
              {expandedSections.contactInfo && (
                <div className="px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={cardDetails.email}
                        onChange={(e) => handleCardInputChange('email', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={cardDetails.phone}
                        onChange={(e) => handleCardInputChange('phone', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address Section */}
            <div className="bg-gray-800/50 rounded-lg border border-gray-600/50">
              <button
                onClick={() => toggleSection('billingAddress')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <h4 className="text-lg font-semibold text-white">Billing Address</h4>
                {expandedSections.billingAddress ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>
              {expandedSections.billingAddress && (
                <div className="px-4 pt-2 pb-4">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={cardDetails.address}
                        onChange={(e) => handleCardInputChange('address', e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={cardDetails.city}
                          onChange={(e) => handleCardInputChange('city', e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="State"
                          value={cardDetails.state}
                          onChange={(e) => handleCardInputChange('state', e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={cardDetails.zip}
                          onChange={(e) => handleCardInputChange('zip', e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Payment Notice */}
        <div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-center text-sm">
            You will not be billed until your vehicle's service is completed.
          </p>
        </div>

        {/* Complete Booking Button */}
        <button
          onClick={handleCompleteBooking}
          disabled={!isFormValid()}
          className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
            isFormValid()
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Complete Booking
        </button>

      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Combined Booking Summary & Payment Card */}
      <div className="bg-stone-800/80 backdrop-blur-lg rounded-3xl border border-stone-700/50 shadow-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-stone-700/50">
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'vehicle'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'vehicle' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <Car className="w-5 h-5" />
            </div>
            <span className="font-semibold">Vehicle</span>
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'location'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'location' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-semibold">Location</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'summary'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === 'summary' ? 'bg-white/20' : 'bg-orange-500/20'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold">Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 flex items-center justify-center space-x-3 px-4 py-4 transition-all ${
              activeTab === 'payment'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-stone-700/50'
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
              {renderVehicle()}
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
                      <div className="text-white text-lg font-semibold">{bookingData.location?.address || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">City:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location?.city || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">State:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location?.state || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">ZIP:</span>
                      <div className="text-white text-lg font-semibold">{bookingData.location?.zip || 'N/A'}</div>
                    </div>
                    {bookingData.location?.notes ? (
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
              {renderSummary()}
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
