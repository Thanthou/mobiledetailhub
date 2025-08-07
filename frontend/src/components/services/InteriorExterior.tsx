import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Paintbrush, Palette, Play, Image } from 'lucide-react';

export const interiorExteriorService = {
  title: 'Interior/Exterior Detailing',
  description: [
    'Deep interior cleaning: carpets, seats, dashboard, and vents',
    'Exterior hand wash and ceramic coating for a lasting shine',
    'Removes dirt, stains, odors, and surface contaminants',
    'Restores a like-new feel inside and out',
    'Ideal for regular maintenance or full rejuvenation'
  ],
  images: ['/interior-detail.png', '/exterior-detail.png', '/interior-exterior.png', '/detail-complete.png'],
  videos: [
    '/interior2_final.mp4',
    '/exterior1_final.mp4'
  ]
};

interface InteriorExteriorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteriorExteriorModal: React.FC<InteriorExteriorModalProps> = ({ isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'images'>('videos');

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

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === interiorExteriorService.videos.length - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? interiorExteriorService.videos.length - 1 : prev - 1
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
            <ul className="text-gray-700 leading-relaxed text-lg space-y-2">
              {interiorExteriorService.description.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-purple-500 mr-3 mt-1">•</span>
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
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Play className="h-5 w-5 mr-2" />
                Videos ({interiorExteriorService.videos.length})
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`flex items-center px-4 py-2 font-medium transition-colors ${
                  activeTab === 'images'
                    ? 'text-purple-500 border-b-2 border-purple-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Image className="h-5 w-5 mr-2" />
                Images ({interiorExteriorService.images.length})
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
          )}

          {/* Video Gallery */}
          {activeTab === 'videos' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Gallery</h3>
              <div className="relative">
                {/* Main Video */}
                <div className="relative h-96 md:h-[500px] lg:h-[600px] max-w-2xl mx-auto bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={interiorExteriorService.videos[currentVideoIndex]}
                    title={`Interior/Exterior Detailing - Video ${currentVideoIndex + 1}`}
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                  />
                  
                  {/* Navigation Arrows */}
                  {interiorExteriorService.videos.length > 1 && (
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
                {interiorExteriorService.videos.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {interiorExteriorService.videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-4 h-4 rounded-full transition-all ${
                          index === currentVideoIndex ? 'bg-purple-500' : 'bg-gray-300'
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