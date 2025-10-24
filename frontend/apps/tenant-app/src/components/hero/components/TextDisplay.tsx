import React from 'react';

interface TextDisplayProps {
  title: string;
  subtitle: string;
  className?: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ 
  title, 
  subtitle,
  className = "" 
}) => {
  return (
    <div className={`text-center text-theme-text max-w-4xl mx-auto px-4 sm:px-6 ${className}`}>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-4 md:mb-6 [text-wrap:balance] leading-tight">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-theme-text-muted leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default TextDisplay;
