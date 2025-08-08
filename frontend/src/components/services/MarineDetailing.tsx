import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Ship, Anchor, Waves } from 'lucide-react';

export const marineDetailingService = {
  title: 'Marine Detailing',
  description: 'Specialized marine detailing services for boats, yachts, and watercraft. Our marine detailing includes hull cleaning, deck detailing, interior cabin cleaning, engine compartment detailing, and protective coatings designed specifically for marine environments. We use marine-grade products that withstand saltwater and UV exposure.',
  pricing: [
    'Basic Marine Detail: $300 - Hull wash, deck cleaning, and basic interior',
    'Standard Marine Detail: $500 - Includes hull polishing, deck restoration, and interior deep cleaning',
    'Premium Marine Detail: $800 - Full detailing with marine-grade ceramic coating',
    'Luxury Marine Detail: $1200 - Complete restoration with premium marine products'
  ],
  images: [
    '/boat_detailing/boat-detail.png',
    '/boat_detailing/boat-detail2.png',
    '/boat_detailing/boat-detail3.png',
    '/boat_detailing/boat-detail4.png',
    '/boat_detailing/boat-detail5.png'
  ]
};

interface MarineDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarineDetailingModal: React.FC<MarineDetailingModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % marineDetailingService.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + marineDetailingService.images.length) % marineDetailingService.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center space-x-3">
            <Ship className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{marineDetailingService.title}</h2>
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
              <Anchor className="h-5 w-5 mr-2 text-blue-500" />
              Service Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{marineDetailingService.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Waves className="h-5 w-5 mr-2 text-blue-500" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marineDetailingService.pricing.map((price, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
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
                  src={marineDetailingService.images[currentImageIndex]}
                  alt={`Marine Detailing - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {marineDetailingService.images.length > 1 && (
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
              {marineDetailingService.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {marineDetailingService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Marine Detailing Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarineDetailingModal; 