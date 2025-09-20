import React from 'react';

interface ServiceAreasColumnProps {
  serviceAreas?: Array<{
    city: string;
    state: string;
    primary?: boolean;
  }>;
  onServiceAreaClick?: (city: string, state: string) => void;
}

const ServiceAreasColumn: React.FC<ServiceAreasColumnProps> = ({ 
  serviceAreas = [],
  onServiceAreaClick 
}) => {
  // Default states list if no service areas provided
  const defaultStates = [
    'California',
    'Texas', 
    'Florida',
    'New York',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Michigan'
  ];

  const displayItems = serviceAreas.length > 0 ? serviceAreas : defaultStates.map(state => ({ city: '', state }));

  return (
    <div className="text-center md:text-right">
      <h3 className="font-bold text-orange-400 text-xl mb-6">Service Areas</h3>
      <div className="space-y-1">
        {displayItems.map((item, index) => {
          const displayText = item.city ? `${item.city}, ${item.state}` : item.state;
          
          return (
            <div 
              key={`${item.city}-${item.state}-${index}`}
              className={`text-lg cursor-pointer transition-colors duration-200 hover:text-orange-400 block w-full text-center md:text-right ${
                item.primary ? 'text-orange-400 font-semibold' : 'text-white'
              }`}
              onClick={() => {
                if (onServiceAreaClick && item.city) {
                  onServiceAreaClick(item.city, item.state);
                }
              }}
            >
              {displayText}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceAreasColumn;
