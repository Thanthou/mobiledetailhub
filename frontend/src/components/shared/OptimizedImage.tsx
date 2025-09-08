import { Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  webpSrc?: string;
  avifSrc?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  onError?: (src: string) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Image not available',
  webpSrc,
  avifSrc,
  srcSet,
  sizes,
  width,
  height,
  loading = 'lazy',
  fetchpriority = 'auto',
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
      
      {/* Use picture element for modern image formats when available */}
      {(avifSrc || webpSrc) ? (
        <picture>
          {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            onError={handleError}
            onLoad={handleLoad}
            loading={loading}
            width={width}
            height={height}
            decoding="async"
            fetchPriority={fetchpriority}
          />
        </picture>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          onError={handleError}
          onLoad={handleLoad}
          loading={loading}
          width={width}
          height={height}
          decoding="async"
          fetchPriority={fetchpriority}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
