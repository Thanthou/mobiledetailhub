import React, { useEffect, useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || !e.touches[0]) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        setSliderPosition(Math.max(0, sliderPosition - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setSliderPosition(Math.min(100, sliderPosition + 1));
        break;
      case 'Home':
        e.preventDefault();
        setSliderPosition(0);
        break;
      case 'End':
        e.preventDefault();
        setSliderPosition(100);
        break;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => { setIsDragging(false); };
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-stone-700 ring-1 ring-white/10 ${className}`}>
      <div 
        ref={containerRef}
        className="relative w-full h-full cursor-col-resize select-none"
        role="slider"
        tabIndex={0}
        aria-label="Before and after image slider"
        aria-valuenow={sliderPosition}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(sliderPosition)}% - showing ${sliderPosition < 50 ? 'before' : 'after'} image`}
        aria-orientation="horizontal"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchStart={() => { setIsDragging(true); }}
        onTouchEnd={() => { setIsDragging(false); }}
        onKeyDown={handleKeyDown}
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0">
          <img 
            src={beforeImage} 
            alt={`${beforeLabel} image showing the original state`}
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {beforeLabel}
          </div>
        </div>

        {/* After Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${String(100 - sliderPosition)}% 0 0)` }}
        >
          <img 
            src={afterImage} 
            alt={`${afterLabel} image showing the improved state`}
            width={600}
            height={400}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {afterLabel}
          </div>
        </div>

        {/* Slider Line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${String(sliderPosition)}%` }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize">
            <div className="w-1 h-4 bg-stone-300"></div>
            <div className="w-1 h-4 bg-stone-300 ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
