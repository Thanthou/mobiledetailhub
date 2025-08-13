import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onError?: (src: string) => void;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError?.(src);
    console.warn(`Failed to load video: ${src}`);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Only load video when component is mounted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Video not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover"
        onLoadedData={handleLoad}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Custom controls overlay */}
      {!controls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-75 transition-all"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">Loading video...</div>
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
