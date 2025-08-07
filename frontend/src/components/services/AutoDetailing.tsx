import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Car, Shield, Star } from 'lucide-react';

export const autoDetailingService = {
  title: 'Auto Detailing',
  description: 'Professional auto detailing services that bring your vehicle back to showroom condition. Our comprehensive detailing packages include exterior wash, clay bar treatment, paint correction, interior deep cleaning, and protective coatings. We use premium products and techniques to ensure your vehicle looks its absolute best.',
  pricing: [
    'Basic Detail: $150 - Exterior wash, interior vacuum, and basic cleaning',
    'Standard Detail: $250 - Includes clay bar, paint correction, and interior deep cleaning',
    'Premium Detail: $350 - Full detailing with ceramic coating and paint protection',
    'Luxury Detail: $500 - Complete restoration with premium products and extended warranty'
  ],
  images: [
    '/car2.png',
    '/car3.png',
    '/sports.png',
    '/auto_detail.png'
  ]
};

interface AutoDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AutoDetailingModal: React.FC<AutoDetailingModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % autoDetailingService.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + autoDetailingService.images.length) % autoDetailingService.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{autoDetailingService.title}</h2>
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
              <Shield className="h-5 w-5 mr-2 text-orange-500" />
              Service Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{autoDetailingService.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-orange-500" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autoDetailingService.pricing.map((price, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
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
                  src={autoDetailingService.images[currentImageIndex]}
                  alt={`Auto Detailing - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {autoDetailingService.images.length > 1 && (
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
              {autoDetailingService.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {autoDetailingService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
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
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Auto Detailing Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoDetailingModal; 