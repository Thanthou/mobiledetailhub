import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ServiceCardProps } from '@/features/services/types/service.types';

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  className = "" 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleClick = () => {
    // Preserve preview token if present
    const token = searchParams.get('t');
    const route = token ? `${service.route}?t=${token}` : service.route;
    void navigate(route);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const token = searchParams.get('t');
      const route = token ? `${service.route}?t=${token}` : service.route;
      void navigate(route);
    }
  };
  
  return (
    <li>
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View ${service.title}`}
        className={`group relative block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${className}`}
      >
        <div className="aspect-[3/2]">
          <img 
            src={service.imageUrl} 
            alt="" /* decorative; title is visible text */
            loading={service.imagePriority ? "eager" : "lazy"}
            decoding={service.imagePriority ? "sync" : "async"}
            // eslint-disable-next-line react/no-unknown-property -- fetchpriority is a valid HTML attribute (lowercase required)
            fetchpriority={service.imagePriority ? "high" : "low"}
            width={service.imageWidth || 600}
            height={service.imageHeight || 400}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
            <h3 className="text-lg font-semibold">
              {service.title}
            </h3>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ServiceCard;
