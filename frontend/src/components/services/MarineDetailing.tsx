import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Anchor, Shield, ImageIcon } from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';


export const marineDetailingService = {
  title: 'Marine Detailing',
  description: [
    '✅ Hull cleaning and oxidation removal',
    '✅ Deck detailing and non-slip surface restoration',
    '✅ Interior cabin cleaning and sanitization',
    '✅ Engine compartment detailing',
    '✅ Marine-grade ceramic coating for UV protection',
    '✅ Gelcoat restoration and polishing',
    '✅ Canvas and upholstery cleaning',
    '✅ Mobile marine detailing at your dock or marina'
  ],
  pricing: [
    'Basic Marine Detail: $300 - Hull wash, deck cleaning, and basic interior',
    'Standard Marine Detail: $500 - Includes hull polishing, deck restoration, and interior deep cleaning',
    'Premium Marine Detail: $800 - Full detailing with marine-grade ceramic coating',
    'Luxury Marine Detail: $1200 - Complete restoration with premium marine products'
  ],
  images: [
    '/boat_detailing/boat1.jfif',
    '/boat_detailing/boat2.jfif',
    '/boat_detailing/boat3.jfif',
    '/boat_detailing/boat4.jfif',
    '/boat_detailing/boat5.jfif',
    '/boat_detailing/boat6.jfif',
    '/boat_detailing/boat7.jfif',
    '/boat_detailing/boat8.jfif',
    '/boat_detailing/boat9.jfif',
    '/boat_detailing/boat10.jfif',
    '/boat_detailing/boat11.jfif',
    '/boat_detailing/boat12.jfif',
    '/boat_detailing/boat13.jfif',
    '/boat_detailing/boat14.jfif',
    '/boat_detailing/boat15.jfif',
    '/boat_detailing/boat16.jfif',
  ],
  videos: [
    '/boat_detailing/marine-detailing-video1.mp4',
    '/boat_detailing/marine-detailing-video2.mp4'
  ]
};

interface MarineDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const MarineDetailingModal: React.FC<MarineDetailingModalProps> = ({ isOpen, onClose, onBookNow, onRequestQuote }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  // Get service images - no theme system needed
  const getServiceImages = () => {
    return [
      '/boat_detailing/boat1.jfif',
      '/boat_detailing/boat2.jfif',
      '/boat_detailing/boat3.jfif',
      '/boat_detailing/boat4.jfif',
      '/boat_detailing/boat5.jfif',
      '/boat_detailing/boat6.jfif',
      '/boat_detailing/boat7.jfif',
      '/boat_detailing/boat8.jfif',
      '/boat_detailing/boat9.jfif',
      '/boat_detailing/boat10.jfif',
      '/boat_detailing/boat11.jfif',
      '/boat_detailing/boat12.jfif',
      '/boat_detailing/boat13.jfif',
      '/boat_detailing/boat14.jfif',
      '/boat_detailing/boat15.jfif',
      '/boat_detailing/boat16.jfif',
      '/boat_detailing/boat17.jfif',
      '/boat_detailing/boat18.jfif',
      '/boat_detailing/boat19.jfif',
      '/boat_detailing/boat20.jfif',
      '/boat_detailing/boat21.jfif',
      '/boat_detailing/boat22.jfif',
      '/boat_detailing/boat23.jfif',
    ];
  };

  const serviceImages = getServiceImages();

  if (!isOpen) return null;

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % marineDetailingService.videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + marineDetailingService.videos.length) % marineDetailingService.videos.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
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
              <Anchor className="h-5 w-5 mr-2 text-orange-500" />
              Service Description
            </h3>
            <ul className="space-y-2">
              {Array.isArray(marineDetailingService.description) ? (
                marineDetailingService.description.map((item, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed text-lg flex items-start">
                    <span className="mr-2">{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{marineDetailingService.description}</p>
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
                Videos ({marineDetailingService.videos.length})
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
                    src={marineDetailingService.videos[currentVideoIndex]}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {marineDetailingService.videos.length > 1 && (
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
                {marineDetailingService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {marineDetailingService.videos.map((_, index) => (
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
                {serviceImages.length > 0 ? (
                  <div className="relative">
                    <img
                      src={serviceImages[currentImageIndex]}
                      alt={`${marineDetailingService.title} ${currentImageIndex + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        console.warn(`Failed to load image: ${serviceImages[currentImageIndex]}`);
                      }}
                    />
                    {serviceImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + serviceImages.length) % serviceImages.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % serviceImages.length)}
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
                
                {serviceImages.length > 1 && (
                  <div className="flex justify-center space-x-2">
                    {serviceImages.map((_, index) => (
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
          title="Marine Detailing Gallery"
        />
      </div>
    </div>
  );
};

export default MarineDetailingModal; 