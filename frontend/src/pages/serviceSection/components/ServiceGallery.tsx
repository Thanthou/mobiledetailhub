import { useState } from 'react';

import type { ServicePageProps } from '../types';

export const ServiceGallery = ({ serviceData }: ServicePageProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {serviceData.gallery.title}
          </h2>
          <p className="text-lg text-gray-600">
            See the quality of our work
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceData.gallery.images.map((image) => (
            <div 
              key={image.id}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              onClick={() => { setSelectedImage(image.src); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedImage(image.src);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View enlarged image: ${image.alt}`}
            >
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {image.caption && (
                <div className="p-4">
                  <p className="text-gray-600 text-sm">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal for enlarged image */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => { setSelectedImage(null); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedImage(null);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close image modal"
          >
            <div className="max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                onClick={() => { setSelectedImage(null); }}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
