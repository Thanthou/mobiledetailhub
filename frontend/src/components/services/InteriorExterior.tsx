import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Paintbrush, Palette, Sparkles } from 'lucide-react';

export const interiorExteriorService = {
  title: 'Interior/Exterior Detailing',
  description: 'Comprehensive interior and exterior detailing services that restore your vehicle to showroom condition. Our expert technicians use premium products and techniques to clean, protect, and enhance both the interior and exterior surfaces of your vehicle.',
  pricing: [
    'Interior Only: $120 - Deep cleaning of seats, dashboard, and surfaces',
    'Exterior Only: $150 - Wash, clay bar, wax, and tire dressing',
    'Interior & Exterior: $250 - Complete detailing package',
    'Premium Package: $350 - Includes paint correction and ceramic protection'
  ],
  images: ['/interior-detail.png', '/exterior-detail.png', '/interior-exterior.png', '/detail-complete.png']
};

interface InteriorExteriorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteriorExteriorModal: React.FC<InteriorExteriorModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === interiorExteriorService.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? interiorExteriorService.images.length - 1 : prev - 1
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <Paintbrush className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">{interiorExteriorService.title}</h2>
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
              <Palette className="h-5 w-5 mr-2 text-purple-500" />
              Service Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{interiorExteriorService.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interiorExteriorService.pricing.map((price, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
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
                  src={interiorExteriorService.images[currentImageIndex]}
                  alt={`Interior/Exterior Detailing - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {interiorExteriorService.images.length > 1 && (
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
              {interiorExteriorService.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {interiorExteriorService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-purple-500' : 'bg-gray-300'
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
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Interior/Exterior Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteriorExteriorModal; 