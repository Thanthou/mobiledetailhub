import React from 'react';
import Header from './Header';

interface HeroProps {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  header: {
    businessName: string;
    phone: string;
    location: string;
    navLinks: { name: string; href: string; onClick?: () => void }[];
  };
  onRequestQuote?: () => void;
}

const Hero: React.FC<HeroProps> = ({ 
  backgroundImage, 
  headline, 
  subheadline, 
  ctaText, 
  ctaLink,
  header,
  onRequestQuote 
}) => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-end justify-center overflow-hidden">
      {/* Header Overlay */}
      <Header
        businessName={header.businessName}
        phone={header.phone}
        location={header.location}
        navLinks={header.navLinks}
      />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 pb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>
        <p className="text-lg md:text-xl uppercase tracking-widest mb-8 text-gray-200 font-medium">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={ctaLink}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {ctaText}
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRequestQuote?.();
            }}
            className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;