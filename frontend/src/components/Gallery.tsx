import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  beforeSrc?: string;
}

interface GalleryProps {
  // Add any props if needed in the future
}

const Gallery: React.FC<GalleryProps> = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [showBefore, setShowBefore] = useState(false);

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/3784424/pexels-photo-3784424.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Luxury car exterior detailing',
      category: 'exterior',
      beforeSrc: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Interior leather cleaning',
      category: 'interior'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Car wrap installation',
      category: 'wrapping'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Window tinting service',
      category: 'tinting'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/3806274/pexels-photo-3806274.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Paint protection film application',
      category: 'protection',
      beforeSrc: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Ceramic coating application',
      category: 'ceramic'
    },
    {
      id: 7,
      src: 'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Engine bay detailing',
      category: 'exterior'
    },
    {
      id: 8,
      src: 'https://images.pexels.com/photos/3807328/pexels-photo-3807328.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Dashboard restoration',
      category: 'interior'
    },
    {
      id: 9,
      src: 'https://images.pexels.com/photos/3807276/pexels-photo-3807276.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      alt: 'Wheel and tire detailing',
      category: 'exterior',
      beforeSrc: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'auto', name: 'Auto' },
    { id: 'marine', name: 'Marine' },
    { id: 'rv', name: 'RV' },
    { id: 'exterior', name: 'Exterior' },
    { id: 'interior', name: 'Interior' },
    { id: 'ceramic', name: 'Ceramic Coating' },
    { id: 'protection', name: 'Paint Protection' }
  ];

  const filteredImages = selectedCategories.size === 0
    ? galleryImages 
    : galleryImages.filter(img => selectedCategories.has(img.category));

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(new Set());
      return;
    }
    
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowBefore(false);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setShowBefore(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]);
    setShowBefore(false);
  };

  return (
    <section id="gallery" className="bg-stone-900 min-h-screen">
      <div className="flex">
        {/* Vertical Category Filter Sidebar */}
        <div className="w-64 bg-stone-900 p-6 min-h-screen pt-60">
          {/* <h3 className="text-xl font-bold text-white mb-6">Filter Gallery</h3> */}
          <div className="space-y-3">
            {categories.map((category) => {
              const isAllWork = category.id === 'all';
              const isSelected = isAllWork ? selectedCategories.size === 0 : selectedCategories.has(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-stone-700 text-gray-300 hover:bg-stone-600 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedCategories.size === 0 ? 'All Work' : 'Filtered Gallery'}
            </h2>
            <p className="text-gray-300">
              {selectedCategories.size === 0 
                ? `Showing all ${galleryImages.length} images`
                : `Showing ${filteredImages.length} images matching your filters`
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-medium">{image.alt}</p>
                  {image.beforeSrc && (
                    <p className="text-sm text-orange-400">Before/After Available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={showBefore && selectedImage.beforeSrc ? selectedImage.beforeSrc : selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              {/* Image Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedImage.alt}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {categories.find(cat => cat.id === selectedImage.category)?.name || selectedImage.category}
                  </span>
                  {selectedImage.beforeSrc && (
                    <button
                      onClick={() => setShowBefore(!showBefore)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {showBefore ? 'Show After' : 'Show Before'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery; 