import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import { ServiceDetails } from './services';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetails | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!isOpen || !service) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % service.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Description</h3>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
            <ul className="space-y-2">
              {service.pricing.map((price, index) => (
                <li key={index} className="text-gray-700 flex justify-between">
                  <span>{price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Gallery */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gallery</h3>
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={service.images[currentImageIndex]}
                  alt={`${service.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {service.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {service.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {service.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal; 