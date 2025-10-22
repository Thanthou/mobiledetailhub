import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface ServiceCardProps {
  service: ServiceTier;
  position: 'center' | 'left' | 'right';
  isSelected: boolean;
  onSelect: () => void;
  onCardClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  position,
  isSelected,
  onSelect,
  onCardClick
  }) => {
  const getPositionClasses = () => {
    const baseClasses = "bg-stone-800/80 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-300 transform cursor-pointer w-[416px] flex-shrink-0";
    
    switch (position) {
      case 'center':
        return `${baseClasses} scale-100 z-10 ring-2 ${isSelected ? 'ring-green-500 bg-green-800/80' : 'ring-orange-500'}`;
      case 'left':
        return `${baseClasses} scale-90 -translate-x-4 opacity-70`;
      case 'right':
        return `${baseClasses} scale-90 translate-x-4 opacity-70`;
      default:
        return baseClasses;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors";
    if (isSelected) {
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3`;
    }
    return `${baseClasses} bg-orange-500 hover:bg-orange-600 text-white`;
  };

  return (
    <div 
      className={getPositionClasses()} 
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-base font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Service Header */}
      <div className="mb-5">
        <h3 className="text-3xl font-bold text-white mb-3">{service.name}</h3>
        <p className="text-4xl font-bold text-orange-500">
          ${service.price.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
      </div>

      {/* Service Description */}
      <div className="mb-5">
        <p className="text-stone-300 text-base mb-5">{service.description}</p>
        
        {/* Features List */}
        {service.features.length > 0 && (
          <div className="space-y-3">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-center text-base text-stone-300">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when clicking the button
          onSelect();
        }}
        className={getButtonClasses()}
      >
        {isSelected && <CheckCircle size={20} />}
        {isSelected ? 'Selected' : 'Choose'}
      </button>
    </div>
  );
};

export default ServiceCard;
