import React from 'react';

interface ServiceAreasColumnProps {
  businessConfig: any;
  isMDH: boolean;
}

const ServiceAreasColumn: React.FC<ServiceAreasColumnProps> = ({ businessConfig, isMDH }) => {
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-4 text-white">Service Areas</h3>
      <div className="text-orange-500">
        {(businessConfig?.serviceAreas || []).map((area: any, idx: number) => (
          <div key={idx} className="mb-2">
            {area.city}, {area.state}{area.zip ? ` ${area.zip}` : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceAreasColumn;