import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Shield, Zap} from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';

export const paintProtectionFilmService = {
  title: 'Paint Protection Film',
  description: [
    '✅ Shields against rock chips, scratches, and harsh wear',
    '✅ Virtually invisible — preserves your paint\'s original look',
    '✅ See it in action: knife, screws, rocks — the film takes the damage, your paint doesn\'t',
    '✅ Professionally installed for long-lasting, seamless coverage',
    '✅ Watch how PPF is applied and what it can withstand'
  ],
  images: [
    '/ppf/ppf1.jpg',
    '/ppf/ppf2.webp',
    '/ppf/ppf3.webp',
    '/ppf/ppf4.avif',
  ],
        videos: [
    '/ppf/ppf_worth.mp4', // First PPF video
    '/ppf/ppf_final1.mp4', // Second PPF video
  ]
};

interface PaintProtectionFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const PaintProtectionFilmModal: React.FC<PaintProtectionFilmModalProps> = ({ isOpen, onClose, onBookNow, onRequestQuote }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === paintProtectionFilmService.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? paintProtectionFilmService.images.length - 1 : prev - 1
    );
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === paintProtectionFilmService.videos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? paintProtectionFilmService.videos.length - 1 : prev - 1
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">{paintProtectionFilmService.title}</h2>
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
              <Zap className="h-5 w-5 mr-2 text-orange-500" />
              Service Description
            </h3>
            <ul className="space-y-2">
              {Array.isArray(paintProtectionFilmService.description) ? (
                paintProtectionFilmService.description.map((item, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed text-lg flex items-start">
                    <span className="mr-2">{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{paintProtectionFilmService.description}</p>
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
                Videos ({paintProtectionFilmService.videos.length})
              </button>
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Images ({paintProtectionFilmService.images.length})
              </button>
            </div>

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="relative">
                {/* Main Video */}
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={paintProtectionFilmService.videos[currentVideoIndex]}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                    
                  {/* Navigation Arrows */}
                  {paintProtectionFilmService.videos.length > 1 && (
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

                {/* Video Thumbnail Navigation */}
                {paintProtectionFilmService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {paintProtectionFilmService.videos.map((_, index) => (
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
          <div className="mt-8">
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
        </div>

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={paintProtectionFilmService.images}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          title="Paint Protection Film Gallery"
        />
      </div>
    </div>
  );
};

export default PaintProtectionFilmModal; 