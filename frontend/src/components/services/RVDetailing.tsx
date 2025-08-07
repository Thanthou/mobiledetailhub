import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Home, MapPin, Mountain } from 'lucide-react';

export const rvDetailingService = {
  title: 'RV Detailing',
  description: 'Comprehensive RV and motorhome detailing services. Our RV detailing includes exterior wash and wax, interior deep cleaning, awning cleaning, roof inspection and cleaning, slide-out maintenance, and protective coatings. We understand the unique challenges of RV maintenance and use specialized products for these larger vehicles.',
  pricing: [
    'Basic RV Detail: $200 - Exterior wash and basic interior cleaning',
    'Standard RV Detail: $400 - Includes waxing, interior deep cleaning, and awning cleaning',
    'Premium RV Detail: $600 - Full detailing with roof inspection and protective coatings',
    'Luxury RV Detail: $900 - Complete restoration with premium products and extended warranty'
  ],
  images: [
    '/rv-detail.png',
    '/rv-detailed.png',
    '/rv-detailed.png'
  ]
};

interface RVDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RVDetailingModal: React.FC<RVDetailingModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % rvDetailingService.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + rvDetailingService.images.length) % rvDetailingService.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{rvDetailingService.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              Service Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{rvDetailingService.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mountain className="h-5 w-5 mr-2 text-green-500" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rvDetailingService.pricing.map((price, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-gray-700 font-medium">{price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-80 md:h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={rvDetailingService.images[currentImageIndex]}
                  alt={`RV Detailing - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {rvDetailingService.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {rvDetailingService.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {rvDetailingService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-green-500' : 'bg-gray-300'
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
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get RV Detailing Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RVDetailingModal; 