import { Link } from 'react-router-dom';

import { useSiteContext } from '../../../../hooks/useSiteContext';
const autoImage = '/images/services/thumbnails/auto.png';
const boatImage = '/images/services/thumbnails/boat.png';
const rvImage = '/images/services/thumbnails/rv.png';
const ceramicImage = '/images/services/thumbnails/ceramic.png';
const paintCorrectionImage = '/images/services/thumbnails/paint.png';
const ppfImage = '/images/services/thumbnails/ppf.png';

const SERVICES = [
  {
    title: 'Auto Detailing',
    image: autoImage,
    slug: 'auto-detailing',
  },
  {
    title: 'Marine Detailing',
    image: boatImage,
    slug: 'marine-detailing',
  },
  {
    title: 'RV Detailing',
    image: rvImage,
    slug: 'rv-detailing',
  },
  {
    title: 'Ceramic Coating',
    image: ceramicImage,
    slug: 'ceramic-coating',
  },
  {
    title: 'Paint Correction',
    image: paintCorrectionImage,
    slug: 'paint-correction',
  },
  {
    title: 'Paint Protection Film',
    image: ppfImage,
    slug: 'paint-protection-film',
  },
];

const ServicesGrid = () => {
  const { businessSlug } = useSiteContext();
  
  return (
    <section id="services" className="bg-stone-900 py-16">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              to={businessSlug ? `/${businessSlug}/service/${service.slug}` : `/service/${service.slug}`}
              className="group block rounded-lg overflow-hidden shadow-lg bg-stone-800 hover:shadow-2xl transition"
            >
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66.6667%' }}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4">
                    {service.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;