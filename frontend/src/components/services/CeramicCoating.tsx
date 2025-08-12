import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';

export const ceramicCoatingService = {
  title: 'Ceramic Coating',
  description: [
    'Long-lasting protection for your vehicle\'s paint',
    'Creates a hydrophobic surface that repels water and dirt',
    'UV protection to prevent paint fading and oxidation',
    'Maintains showroom shine for years with proper care',
    'Professional-grade ceramic coating application'
  ],
  images: [
    '/ceramic/ceramic1.jpeg',
    '/ceramic/ceramic2.png',
    '/ceramic/service_image.png'
  ],
  videos: [
    '/ceramic/video1.mp4',
    '/ceramic/video2.mp4'
  ]
};

interface CeramicCoatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CeramicCoatingModal: React.FC<CeramicCoatingModalProps> = ({ isOpen, onClose }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{ceramicCoatingService.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Overview</h3>
            <ul className="space-y-2 text-gray-600">
              {ceramicCoatingService.description.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Media Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Images</h3>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  View All ({ceramicCoatingService.images.length})
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ceramicCoatingService.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={`${ceramicCoatingService.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Videos</h3>
              <div className="space-y-3">
                {ceramicCoatingService.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={video}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8">
            <CTAButtonsContainer />
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={ceramicCoatingService.images}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default CeramicCoatingModal; 