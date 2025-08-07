import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Shield, Sparkles, Play, Image } from 'lucide-react';

export const ceramicCoatingService = {
  title: 'Ceramic Coating',
  description: [
    'Long-lasting protection (1–7 years)',
    'High-gloss, showroom finish',
    'Scratch and swirl resistance',
    'UV and environmental protection',
    'Easier maintenance and cleaning',
    'Repels water, dirt, and grime'
  ],
  images: ['/ceramic-coating.png', '/ceramic-application.png', '/ceramic-result.png', '/ceramic-protection.png'],
  videos: [
    '/cc_final1.mp4'
  ]
};

interface CeramicCoatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CeramicCoatingModal: React.FC<CeramicCoatingModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'images'>('videos');

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

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === ceramicCoatingService.videos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? ceramicCoatingService.videos.length - 1 : prev - 1
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
            <ul className="text-gray-700 leading-relaxed text-lg space-y-2">
              {ceramicCoatingService.description.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-500 mr-3 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center px-4 py-2 font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Play className="h-5 w-5 mr-2" />
                Videos ({ceramicCoatingService.videos.length})
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center px-4 py-2 font-medium transition-colors ${
                  activeTab === 'images'
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Image className="h-5 w-5 mr-2" />
                Images ({ceramicCoatingService.images.length})
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          {activeTab === 'images' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Image Gallery</h3>
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
          )}

          {/* Video Gallery */}
          {activeTab === 'videos' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Gallery</h3>
              <div className="relative">
                {/* Main Video */}
                <div className="relative h-96 md:h-[500px] lg:h-[600px] max-w-2xl mx-auto bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={ceramicCoatingService.videos[currentVideoIndex]}
                    title={`Ceramic Coating - Video ${currentVideoIndex + 1}`}
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                  />
                  
                  {/* Navigation Arrows */}
                  {ceramicCoatingService.videos.length > 1 && (
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
                {ceramicCoatingService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {ceramicCoatingService.videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-4 h-4 rounded-full transition-all ${
                          index === currentVideoIndex ? 'bg-cyan-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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