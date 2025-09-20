import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceCardProps } from '@/features/services/types/service.types';

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  className = "" 
}) => {
  return (
    <li>
      <Link
        to={service.route}
        aria-label={`View ${service.title}`}
        className={`group relative block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl ${className}`}
      >
        <div className="aspect-[3/2]">
          <img 
            src={service.imageUrl} 
            alt="" /* decorative; title is visible text */
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
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
      </Link>
    </li>
  );
};

export default ServiceCard;
