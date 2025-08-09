import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Paintbrush, Palette} from 'lucide-react';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';
import ImageGalleryModal from '../ImageGalleryModal';

export const interiorExteriorService = {
  title: 'Interior/Exterior Detailing',
  description: [
    '✅ Deep interior cleaning: carpets, seats, dashboard, and vents',
    '✅ Exterior hand wash and ceramic coating for a lasting shine',
    '✅ Removes dirt, stains, odors, and surface contaminants',
    '✅ Restores a like-new feel inside and out',
    '✅ Ideal for regular maintenance or full rejuvenation'
  ],
  images: ['/interior_exterior/interior1.jfif',
    '/interior_exterior/interior2.jfif',
  ],
  videos: [
    '/interior_exterior/video1.mp4',
    '/interior_exterior/video3.mp4',
    '/interior_exterior/video4.mp4',
  ]
};

interface InteriorExteriorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: () => void;
  onRequestQuote?: () => void;
}

const InteriorExteriorModal: React.FC<InteriorExteriorModalProps> = ({ isOpen, onClose, onBookNow, onRequestQuote }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'images'>('videos');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);



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
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-lg flex justify-between items-center">
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
              <Palette className="h-5 w-5 mr-2 text-orange-500" />
              Service Description
            </h3>
            <ul className="space-y-2">
              {Array.isArray(interiorExteriorService.description) ? (
                interiorExteriorService.description.map((item, index) => (
                  <li key={index} className="text-gray-700 leading-relaxed text-lg flex items-start">
                    <span className="mr-2">{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">{interiorExteriorService.description}</p>
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
                 Videos ({interiorExteriorService.videos.length})
               </button>
               <button
                 onClick={() => setIsGalleryOpen(true)}
                 className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
               >
                 Images ({interiorExteriorService.images.length})
               </button>
             </div>

                       {/* Videos Tab */}
                       {activeTab === 'videos' && (
                         <div className="relative">
                                            {/* Main Video */}
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <video
                    src={interiorExteriorService.videos[currentVideoIndex]}
                    controls
                    className="w-full max-h-96 object-contain"
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
                    images={interiorExteriorService.images}
                    currentIndex={currentImageIndex}
                    onIndexChange={setCurrentImageIndex}
                    title="Interior/Exterior Detailing Gallery"
                  />
               </div>
             </div>
           );
         };

export default InteriorExteriorModal; 