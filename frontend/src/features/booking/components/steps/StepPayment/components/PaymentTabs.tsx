import React from 'react';
import { Car, CreditCard, FileText, MapPin } from 'lucide-react';

interface PaymentTabsProps {
  activeTab: 'vehicle' | 'location' | 'summary' | 'payment';
  onTabChange: (tab: 'vehicle' | 'location' | 'summary' | 'payment') => void;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'vehicle' as const, label: 'Vehicle', icon: Car },
    { id: 'location' as const, label: 'Location', icon: MapPin },
    { id: 'summary' as const, label: 'Summary', icon: FileText },
    { id: 'payment' as const, label: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === id
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default PaymentTabs;
