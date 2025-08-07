import React, { useState } from 'react';
import { Car, Shield, Paintbrush, Palette, Sun, Zap } from 'lucide-react';
import AutoDetailingModal from './services/AutoDetailing';
import MarineDetailingModal from './services/MarineDetailing';
import RVDetailingModal from './services/RVDetailing';
import InteriorExteriorModal from './services/InteriorExterior';
import CeramicCoatingModal from './services/CeramicCoating';
import PaintProtectionFilmModal from './services/PaintProtectionFilm';

interface ServiceItem {
  title: string;
  image: string;
  icon: React.ReactNode;
}

interface ServicesGridProps {
  services: ServiceItem[];
  onRequestQuote?: () => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, onRequestQuote }) => {
  const [isAutoDetailingModalOpen, setIsAutoDetailingModalOpen] = useState(false);
  const [isMarineDetailingModalOpen, setIsMarineDetailingModalOpen] = useState(false);
  const [isRVDetailingModalOpen, setIsRVDetailingModalOpen] = useState(false);
  const [isInteriorExteriorModalOpen, setIsInteriorExteriorModalOpen] = useState(false);
  const [isCeramicCoatingModalOpen, setIsCeramicCoatingModalOpen] = useState(false);
  const [isPaintProtectionFilmModalOpen, setIsPaintProtectionFilmModalOpen] = useState(false);

  const handleServiceClick = (service: ServiceItem) => {
    // Scroll down a bit more when a service is clicked
    window.scrollBy({ top: 100, behavior: 'smooth' });
    
    if (service.title === 'Auto Detailing') {
      setIsAutoDetailingModalOpen(true);
    } else if (service.title === 'Marine Detailing') {
      setIsMarineDetailingModalOpen(true);
    } else if (service.title === 'RV Detailing') {
      setIsRVDetailingModalOpen(true);
    } else if (service.title === 'Interior / Exterior') {
      setIsInteriorExteriorModalOpen(true);
    } else if (service.title === 'Ceramic Coating') {
      setIsCeramicCoatingModalOpen(true);
    } else if (service.title === 'Paint Protection Film') {
      setIsPaintProtectionFilmModalOpen(true);
    }
  };

  const closeAutoDetailingModal = () => {
    setIsAutoDetailingModalOpen(false);
  };

  const closeMarineDetailingModal = () => {
    setIsMarineDetailingModalOpen(false);
  };

  const closeRVDetailingModal = () => {
    setIsRVDetailingModalOpen(false);
  };

  const closeInteriorExteriorModal = () => {
    setIsInteriorExteriorModalOpen(false);
  };

  const closeCeramicCoatingModal = () => {
    setIsCeramicCoatingModalOpen(false);
  };

  const closePaintProtectionFilmModal = () => {
    setIsPaintProtectionFilmModalOpen(false);
  };

  return (
    <section className="bg-stone-900 py-16">
      {/* Full Width Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative h-80 md:h-96 lg:h-[28rem] overflow-hidden group cursor-pointer rounded-lg shadow-lg"
            onClick={() => handleServiceClick(service)}
          >
            <img
              src={service.image}
              alt={service.title}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                service.image.includes('boat-detail4.png') ? 'object-fill' : ''
              }`}
            />
            
            {/* Service Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-lg md:text-xl font-bold">{service.title}</h3>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Call to Action Buttons */}
      <div className="text-center py-20 px-4">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Choose your preferred way to get in touch. We're here to help with all your detailing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/booking?detailer_id=joe123"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Book Now
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

      {/* Service Modals */}
      <AutoDetailingModal
        isOpen={isAutoDetailingModalOpen}
        onClose={closeAutoDetailingModal}
      />
      <MarineDetailingModal
        isOpen={isMarineDetailingModalOpen}
        onClose={closeMarineDetailingModal}
      />
                  <RVDetailingModal
              isOpen={isRVDetailingModalOpen}
              onClose={closeRVDetailingModal}
            />
            <InteriorExteriorModal
              isOpen={isInteriorExteriorModalOpen}
              onClose={closeInteriorExteriorModal}
            />
            <CeramicCoatingModal
              isOpen={isCeramicCoatingModalOpen}
              onClose={closeCeramicCoatingModal}
            />
            <PaintProtectionFilmModal
              isOpen={isPaintProtectionFilmModalOpen}
              onClose={closePaintProtectionFilmModal}
            />
    </section>
  );
};

export default ServicesGrid;