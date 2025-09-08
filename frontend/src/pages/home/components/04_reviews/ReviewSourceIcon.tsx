import React from 'react';
import { createRoot } from 'react-dom/client';

interface ReviewSourceIconProps {
  source: 'website' | 'google' | 'yelp' | 'facebook' | 'imported';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReviewSourceIcon: React.FC<ReviewSourceIconProps> = ({ 
  source, 
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  // Image paths for each source
  const getImagePath = (source: string) => {
    // Try SVG first, then PNG as fallback
    return `/images/review-sources/${source}.svg`;
  };

  const getImagePathFallback = (source: string) => {
    return `/images/review-sources/${source}.png`;
  };

  // Fallback to inline SVG if image doesn't exist
  const renderFallbackIcon = (source: string) => {
    switch (source) {
      case 'google':
        return (
          <div className={`${baseClasses} bg-white rounded-sm flex items-center justify-center`} title="Google">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
        );

      case 'yelp':
        return (
          <div className={`${baseClasses} bg-red-600 rounded-sm flex items-center justify-center`} title="Yelp">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path fill="currentColor" d="M8.5 6.5c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5zm7 0c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
        );

      case 'facebook':
        return (
          <div className={`${baseClasses} bg-blue-600 rounded-sm flex items-center justify-center`} title="Facebook">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );

      case 'website':
        return (
          <div className={`${baseClasses} bg-orange-500 rounded-sm flex items-center justify-center`} title="Website">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        );

      case 'imported':
        return (
          <div className={`${baseClasses} bg-gray-500 rounded-sm flex items-center justify-center`} title="Imported">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} bg-gray-400 rounded-sm flex items-center justify-center`} title="Unknown">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
              <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={`${baseClasses} rounded-sm overflow-hidden`} title={source.charAt(0).toUpperCase() + source.slice(1)}>
      <img 
        src={getImagePath(source)} 
        alt={`${source} review`}
        className={`w-full h-full object-contain ${
          source === 'website' ? 'brightness-0 invert' : ''
        }`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;
          
          // Try PNG fallback first
          if (target.src.includes('.svg')) {
            target.src = getImagePathFallback(source);
            return;
          }
          
          // If PNG also fails, use inline SVG fallback
          if (parent) {
            parent.innerHTML = '';
            const fallbackElement = document.createElement('div');
            parent.appendChild(fallbackElement);
            const root = createRoot(fallbackElement);
            root.render(renderFallbackIcon(source));
          }
        }}
      />
    </div>
  );
};
