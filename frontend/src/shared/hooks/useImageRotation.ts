import { useEffect, useState } from 'react';

interface UseImageRotationProps {
  images: string[];
  interval?: number;
}

export const useImageRotation = ({ images, interval = 8000 }: UseImageRotationProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, interval);
    
    return () => { clearInterval(timer); };
  }, [images.length, interval]);

  return currentImageIndex;
};
