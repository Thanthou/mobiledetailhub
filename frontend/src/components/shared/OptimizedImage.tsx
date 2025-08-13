import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  onError?: (src: string) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Image not available',
  onError
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.(src);
    console.warn(`Failed to load image: ${src}`);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center w-full h-full ${className}`}>
        <div className="text-center text-gray-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
