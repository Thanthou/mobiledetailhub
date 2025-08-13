import React, { useState } from 'react';
import AutoDetailingModal from './services/AutoDetailing';
import MarineDetailingModal from './services/MarineDetailing';
import RVDetailingModal from './services/RVDetailing';
import InteriorExteriorModal from './services/InteriorExterior';
import CeramicCoatingModal from './services/CeramicCoating';
import PaintProtectionFilmModal from './services/PaintProtectionFilm';
import { GetStarted } from './shared';

interface ServiceItem {
  title: string;
  image: string;
  images?: string[]; // Array of images for rotation
  icon: React.ReactNode;
}

interface ServicesGridProps {
  services: ServiceItem[];
  onBookNow?: () => void;
  onRequestQuote?: () => void;
  businessSlug?: string; // Add business slug to determine which CTA to show
}

// Static image display component (no rotation)
const StaticImageDisplay: React.FC<{ images: string[]; className?: string; alt?: string }> = ({ images, className, alt }) => {
  // Use the first image from the array, or fallback to the single image
  const displayImage = images && images.length > 0 ? images[0] : '';
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={displayImage}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, onBookNow, onRequestQuote, businessSlug }) => {
  const [isAutoDetailingModalOpen, setIsAutoDetailingModalOpen] = useState(false);
  const [isMarineDetailingModalOpen, setIsMarineDetailingModalOpen] = useState(false);
  const [isRVDetailingModalOpen, setIsRVDetailingModalOpen] = useState(false);
  const [isInteriorExteriorModalOpen, setIsInteriorExteriorModalOpen] = useState(false);
  const [isCeramicCoatingModalOpen, setIsCeramicCoatingModalOpen] = useState(false);
  const [isPaintProtectionFilmModalOpen, setIsPaintProtectionFilmModalOpen] = useState(false);

  // Debug logging when services prop changes
  React.useEffect(() => {
    console.log('ServicesGrid: Services prop updated:', services);
    services.forEach((service, index) => {
      console.log(`ServicesGrid: Service ${index + 1}: ${service.title} - Image: ${service.image}`);
    });
  }, [services]);

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
            <div className="relative overflow-hidden rounded-lg h-full w-full transition-transform duration-300 hover:scale-105">
              {service.title === 'Auto Detailing' ? (
                <StaticImageDisplay
                  images={service.images || [service.image]}
                  className="w-full h-full"
                  alt={service.title}
                />
              ) : service.title === 'Marine Detailing' ? (
                <StaticImageDisplay
                  images={service.images || [service.image]}
                  className="w-full h-full"
                  alt={service.title}
                />
              ) : service.title === 'RV Detailing' ? (
                <StaticImageDisplay
                  images={service.images || [service.image]}
                  className="w-full h-full"
                  alt={service.title}
                />
              ) : (
                <StaticImageDisplay
                  images={service.images || [service.image]}
                  className="w-full h-full"
                  alt={service.title}
                />
              )}
            </div>
            
            {/* Service Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/70 to-transparent z-20">
              <h3 className="text-lg md:text-xl font-bold">{service.title}</h3>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 transition-all duration-300 z-10" />
          </div>
        ))}
      </div>

      {/* Call to Action Buttons */}
      <div className="text-center py-20 px-4">
        {businessSlug === 'mdh' ? (
          // Show GetStarted for MDH
          <div className="max-w-md mx-auto">
            <GetStarted
              onLocationSubmit={(location, zipCode, city, state) => {
                // Handle location submission - you can customize this behavior
                console.log('Location submitted:', { location, zipCode, city, state });
                // You could open a booking modal or redirect to a booking page
              }}
              placeholder="Enter your zip code or city to get started"
              className="w-full"
            />
          </div>
        ) : (
          // Show original buttons for other businesses
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onBookNow}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-12 rounded-lg text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Book Now
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onRequestQuote?.();
              }}
              className="inline-block bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-6 px-12 rounded-lg text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Request a Quote
            </a>
          </div>
        )}
      </div>

      {/* Service Modals */}
      <AutoDetailingModal
        isOpen={isAutoDetailingModalOpen}
        onClose={closeAutoDetailingModal}
        onBookNow={() => {
          closeAutoDetailingModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
      <MarineDetailingModal
        isOpen={isMarineDetailingModalOpen}
        onClose={closeMarineDetailingModal}
        onBookNow={() => {
          closeMarineDetailingModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
      <RVDetailingModal
        isOpen={isRVDetailingModalOpen}
        onClose={closeRVDetailingModal}
        onBookNow={() => {
          closeRVDetailingModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
      <InteriorExteriorModal
        isOpen={isInteriorExteriorModalOpen}
        onClose={closeInteriorExteriorModal}
        onBookNow={() => {
          closeInteriorExteriorModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
      <CeramicCoatingModal
        isOpen={isCeramicCoatingModalOpen}
        onClose={closeCeramicCoatingModal}
        onBookNow={() => {
          closeCeramicCoatingModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
      <PaintProtectionFilmModal
        isOpen={isPaintProtectionFilmModalOpen}
        onClose={closePaintProtectionFilmModal}
        onBookNow={() => {
          closePaintProtectionFilmModal();
          // onBookNow?.(); // This prop was removed from ServicesGridProps
        }}
        onRequestQuote={() => {
          // onRequestQuote?.(); // This prop was removed from ServicesGridProps
        }}
      />
    </section>
  );
};

export default ServicesGrid;