import React from 'react';
import { GalleryImage } from '../types';

interface GalleryItemProps {
  image: GalleryImage;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image }) => {
  try {
    return (
    <li>
      <div className="group relative block rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="aspect-[3/2]">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={image.loading || 'lazy'}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Show a simple placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="absolute inset-0 w-full h-full bg-stone-700 flex items-center justify-center">
                    <div class="text-center text-stone-400">
                      <div class="text-4xl mb-2">📷</div>
                      <div class="text-sm">Add ${image.src.split('/').pop()}</div>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 truncate">
              {image.title || 'Untitled'}
            </h3>
            <p className="text-stone-300 text-xs overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {image.caption || 'No description available'}
            </p>
          </div>
        </div>
      </div>
    </li>
    );
  } catch (error) {
    console.error('Error rendering gallery item:', error);
    return (
      <li>
        <div className="group relative block rounded-lg overflow-hidden shadow-lg bg-stone-700">
          <div className="aspect-[3/2] flex items-center justify-center">
            <span className="text-stone-400">Error loading image</span>
          </div>
        </div>
      </li>
    );
  }
};

export default GalleryItem;
