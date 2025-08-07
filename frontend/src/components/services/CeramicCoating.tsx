import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Shield, Sparkles, Zap } from 'lucide-react';

export const ceramicCoatingService = {
  title: 'Ceramic Coating',
  description: 'Professional ceramic coating application that provides long-lasting protection for your vehicle. Our nano-ceramic coatings create a hydrophobic barrier that repels water, dirt, and contaminants while maintaining a brilliant shine for years.',
  pricing: [
    'Basic Coating: $800 - 2-year protection with basic prep',
    'Standard Coating: $1200 - 5-year protection with paint correction',
    'Premium Coating: $1800 - 9-year protection with full paint restoration',
    'Luxury Coating: $2500 - 10-year protection with multi-layer application'
  ],
  images: ['/ceramic-coating.png', '/ceramic-application.png', '/ceramic-result.png', '/ceramic-protection.png']
};

interface CeramicCoatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CeramicCoatingModal: React.FC<CeramicCoatingModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === ceramicCoatingService.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? ceramicCoatingService.images.length - 1 : prev - 1
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">{ceramicCoatingService.title}</h2>
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
              <Sparkles className="h-5 w-5 mr-2 text-cyan-500" />
              Service Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">{ceramicCoatingService.description}</p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-cyan-500" />
              Pricing Packages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ceramicCoatingService.pricing.map((price, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-cyan-500">
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
                  src={ceramicCoatingService.images[currentImageIndex]}
                  alt={`Ceramic Coating - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {ceramicCoatingService.images.length > 1 && (
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
              {ceramicCoatingService.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {ceramicCoatingService.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-cyan-500' : 'bg-gray-300'
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
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Ceramic Coating Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeramicCoatingModal; 