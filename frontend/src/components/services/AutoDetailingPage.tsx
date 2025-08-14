import React from 'react';
import { Car, Shield, Image as ImageIcon } from 'lucide-react';
import ImageRotator from '../shared/ImageRotator';
import CTAButtonsContainer from '../shared/CTAButtonsContainer';

const AutoDetailingPage: React.FC = () => {
  const serviceImages = [
    '/auto_detailing/car1.jfif',
    '/auto_detailing/car2.jfif',
    '/auto_detailing/car3.jfif',
    '/auto_detailing/car4.jfif',
    '/auto_detailing/car5.webp',
  ];

  const highlights = [
    'Professional exterior hand wash and wax',
    'Clay bar treatment for smooth paint surface',
    'Paint correction and polishing for showroom shine',
    'Interior deep cleaning and sanitization',
    'Leather conditioning and fabric protection',
    'Wheel and tire cleaning with UV protectant',
    'Engine bay cleaning (if requested)',
    'Mobile detailing at your home or office'
  ];

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Hero Section with Image Rotator */}
      <section className="relative h-screen min-h-[600px] flex items-end justify-center overflow-hidden">
        <ImageRotator
          images={serviceImages}
          interval={5000}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Auto detailing service"
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white px-4 pb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Auto Detailing
          </h1>
          <p className="text-lg md:text-xl uppercase tracking-widest mb-8 text-gray-200 font-medium">
            Professional Care for Your Vehicle
          </p>
          <CTAButtonsContainer
            onBookNow={() => {
              // Handle book now action
            }}
            onRequestQuote={() => {
              // Handle request quote action
            }}
          />
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Service Description */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Complete Auto Detailing Services
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our comprehensive auto detailing service transforms your vehicle from ordinary to extraordinary. 
                We use premium products and professional techniques to restore your car's showroom shine.
              </p>
              
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Car className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">Service Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {serviceImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`Auto detailing ${index + 1}`}
                      className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Book your auto detailing service today and experience the difference professional care makes.
          </p>
          <CTAButtonsContainer
            onBookNow={() => {
              // Handle book now action
            }}
            onRequestQuote={() => {
              // Handle request quote action
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default AutoDetailingPage;
