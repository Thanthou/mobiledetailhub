import { useState } from 'react';

export interface PaymentFormData {
  paymentMethod: string;
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  activeTab: 'vehicle' | 'location' | 'summary' | 'payment';
  expandedSections: {
    cardInfo: boolean;
    contactInfo: boolean;
    billingAddress: boolean;
  };
}

/**
 * Hook to manage payment form state
 * Separates form state from UI components
 */
export const usePaymentForm = () => {
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

  const updateCardDetails = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ 
      ...prev, 
      [section]: !prev[section] 
    }));
  };

  const resetForm = () => {
    setPaymentMethod('');
    setCardDetails({
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
    setActiveTab('vehicle');
    setExpandedSections({
      cardInfo: false,
      contactInfo: false,
      billingAddress: false
    });
  };

  return {
    // State
    paymentMethod,
    cardDetails,
    activeTab,
    expandedSections,
    
    // Actions
    setPaymentMethod,
    updateCardDetails,
    setActiveTab,
    toggleSection,
    resetForm
  };
};
