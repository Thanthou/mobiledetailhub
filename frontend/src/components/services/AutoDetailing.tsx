import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Car, Shield, Image as ImageIcon } from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';


export const autoDetailingService = {
  title: 'Auto Detailing',
  description: [
    '✅ Professional exterior hand wash and wax',
    '✅ Clay bar treatment for smooth paint surface',
    '✅ Paint correction and polishing for showroom shine',
    '✅ Interior deep cleaning and sanitization',
    '✅ Leather conditioning and fabric protection',
    '✅ Wheel and tire cleaning with UV protectant',
    '✅ Engine bay cleaning (if requested)',
    '✅ Mobile detailing at your home or office'
  ],
  images: [
    '/auto_detailing/car1.jfif',
    '/auto_detailing/car2.jfif',
    '/auto_detailing/car3.jfif',
    '/auto_detailing/car4.jfif',
    '/auto_detailing/car5.webp',
  ],
  videos: [
    '/auto_detailing/auto-detailing-video1.mp4',
    '/auto_detailing/auto-detailing-video2.mp4'
  ]
};

interface AutoDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const AutoDetailingModal: React.FC<AutoDetailingModalProps> = ({ isOpen, onClose, onBookNow, onRequestQuote }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Get service images - no theme system needed
  const getServiceImages = () => {
    return [
      '/auto_detailing/car1.jfif',
      '/auto_detailing/car2.jfif',
      '/auto_detailing/car3.jfif',
      '/auto_detailing/car4.jfif',
      '/auto_detailing/car5.webp',
    ];
  };

  const serviceImages = getServiceImages();

  // Handle image loading errors
  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set(prev).add(imagePath));
    console.warn(`Failed to load image: ${imagePath}`);
  };

  // Filter out images that failed to load
  const validImages = serviceImages.filter(img => !imageErrors.has(img));

  if (!isOpen) return null;

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % autoDetailingService.videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + autoDetailingService.videos.length) % autoDetailingService.videos.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
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
            <ul className="space-y-2">
              {Array.isArray(autoDetailingService.description) ? (
                autoDetailingService.description.map((item, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed text-lg flex items-start">
                    <span className="mr-2">{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{autoDetailingService.description}</p>
              )}
            </ul>
          </div>

          {/* Gallery */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'videos'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Videos ({autoDetailingService.videos.length})
              </button>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Images ({serviceImages.length})
              </button>
            </div>

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="relative">
                {/* Main Video */}
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={autoDetailingService.videos[currentVideoIndex]}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {autoDetailingService.videos.length > 1 && (
                    <>
                      <button
                        onClick={prevVideo}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextVideo}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {autoDetailingService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {autoDetailingService.videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-4 h-4 rounded-full transition-all ${
                          index === currentVideoIndex ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                {validImages.length > 0 ? (
                  <div className="relative">
                    <img
                      src={validImages[currentImageIndex]}
                      alt={`${autoDetailingService.title} ${currentImageIndex + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                      onError={() => handleImageError(validImages[currentImageIndex])}
                    />
                    {validImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p>No images available</p>
                    </div>
                  </div>
                )}
                
                {validImages.length > 1 && (
                  <div className="flex justify-center space-x-2">
                    {validImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}


          </div>

          {/* CTA Buttons */}
          <CTAButtonsContainer
            onBookNow={() => {
              onClose();
              onBookNow?.();
            }}
            onRequestQuote={() => {
              onClose();
              onRequestQuote?.();
            }}
          />
        </div>

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={serviceImages}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          title="Auto Detailing Gallery"
        />
      </div>
    </div>
  );
};

export default AutoDetailingModal; 