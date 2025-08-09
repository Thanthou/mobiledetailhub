import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Home, MapPin} from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';

export const rvDetailingService = {
  title: 'RV Detailing',
  description: [
    'Full exterior hand wash and wax (includes roof, awnings, and slide-outs)',
    '✅ Oxidation removal and paint polishing for a restored shine',
    '✅ Window, mirror, and chrome cleaning',
    '✅ Wheel and tire cleaning with UV protectant',
    '✅ Bug and tar removal from front cap and windshield',
    '✅ Interior vacuuming, surface wipe-down, and deodorizing (if requested)',
    '✅ Safe for all RV classes: Class A, B, C, trailers, and fifth wheels',
    '✅ Mobile RV detailing at your home, park, storage lot, or campground'
  ],
  pricing: [
    'Basic RV Detail: $200 - Exterior wash and basic interior cleaning',
    'Standard RV Detail: $400 - Includes waxing, interior deep cleaning, and awning cleaning',
    'Premium RV Detail: $600 - Full detailing with roof inspection and protective coatings',
    'Luxury RV Detail: $900 - Complete restoration with premium products and extended warranty'
  ],
  images: [
    '/rv_detailing/rv1.png',
    '/rv_detailing/rv2.jfif',
    '/rv_detailing/rv3.jfif',
    '/rv_detailing/rv4.jfif',
    '/rv_detailing/rv5.jfif',
    '/rv_detailing/rv6.jfif',
    '/rv_detailing/rv7.jfif',
    '/rv_detailing/rv8.jfif',
  ],
  videos: [
    '/rv_detailing/rv-detailing-video1.mp4',
    '/rv_detailing/rv-detailing-video2.mp4'
  ]
};

interface RVDetailingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const RVDetailingModal: React.FC<RVDetailingModalProps> = ({ isOpen, onClose, onBookNow, onRequestQuote }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!isOpen) return null;

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % rvDetailingService.videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + rvDetailingService.videos.length) % rvDetailingService.videos.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-orange-600 text-white">
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
              <MapPin className="h-5 w-5 mr-2 text-orange-500" />
              Service Description
            </h3>
            <ul className="space-y-2">
              {Array.isArray(rvDetailingService.description) ? (
                rvDetailingService.description.map((item, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed text-lg flex items-start">
                    <span className="mr-2">{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{rvDetailingService.description}</p>
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
                Videos ({rvDetailingService.videos.length})
              </button>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Images ({rvDetailingService.images.length})
              </button>
            </div>

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="relative">
                {/* Main Video */}
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={rvDetailingService.videos[currentVideoIndex]}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {rvDetailingService.videos.length > 1 && (
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
                {rvDetailingService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {rvDetailingService.videos.map((_, index) => (
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
          images={rvDetailingService.images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          title="RV Detailing Gallery"
        />
      </div>
    </div>
  );
};

export default RVDetailingModal; 