import React from 'react';

interface TextDisplayProps {
  title: string;
  subtitle: string;
  isLocation: boolean;
  locationName: string;
  className?: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ 
  title, 
  subtitle, 
  isLocation,
  locationName,
  className = "" 
}) => {
  return (
    <div className={`text-center text-white max-w-4xl mx-auto px-6 ${className}`}>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 [text-wrap:balance]">
        {isLocation ? (
          <>
            <span className="block text-4xl md:text-6xl">Mobile Detailing in</span>
            <span className="block text-5xl md:text-7xl">{locationName}</span>
          </>
        ) : (
          title
        )}
      </h1>
      <p className="text-3xl md:text-4xl text-gray-200">
        {subtitle}
      </p>
    </div>
  );
};

export default TextDisplay;
