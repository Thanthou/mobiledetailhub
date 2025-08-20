import React, { useEffect, useState } from 'react';
import { useSiteContext } from '../../../hooks/useSiteContext';

interface ServiceArea {
  state: string;
  city: string;
  zip?: string;
}

const ServiceAreas: React.FC = () => {
  const { businessSlug } = useSiteContext();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessSlug) return;
    
    setLoading(true);
    fetch(`/api/businesses/${businessSlug}/business_area`)
      .then(res => res.json())
      .then(data => {
        setServiceAreas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [businessSlug]);

  if (loading) return <div className="text-white">Loading service areas...</div>;

  if (serviceAreas.length === 0) {
    return (
      <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center max-w-md">
        <h3 className="text-xl font-bold mb-4 text-white">
          Service Areas
        </h3>
        <p className="text-gray-300">No service areas found.</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center max-w-md">
      <h3 className="text-xl font-bold mb-4 text-white">
        Service Areas
      </h3>
      
      <div className="space-y-2">
        {serviceAreas.map((area, index) => (
          <div
            key={`${area.city}-${area.state}-${index}`}
            className="text-orange-400 text-sm"
          >
            {area.city}, {area.state}
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-300 mt-6">
        Don't see your area? Give us a call - we may still be able to help!
      </p>
    </div>
  );
};

export default ServiceAreas;
