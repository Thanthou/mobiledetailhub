import autoImage from '/assets/auto.png';
import boatImage from '/assets/boat.png';
import rvImage from '/assets/rv.png';
import ceramicImage from '/assets/ceramic.png';
import paintCorrectionImage from '/assets/paint_correction.png';
import ppfImage from '/assets/ppf.png';

const SERVICES = [
  {
    title: 'Auto Detailing',
    image: autoImage,
    link: '#',
  },
  {
    title: 'Marine Detailing',
    image: boatImage,
    link: '#',
  },
  {
    title: 'RV Detailing',
    image: rvImage,
    link: '#',
  },
  
  {
    title: 'Ceramic Coating',
    image: ceramicImage,
    link: '#',
  },
  {
    title: 'Paint Correction',
    image: paintCorrectionImage,
    link: '#',
  },
  {
    title: 'Paint Protection Film',
    image: ppfImage,
    link: '#',
  },
];

const ServicesGrid = () => {
  return (
    <section id="services" className="bg-stone-900 py-16">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((service) => (
            <a
              key={service.title}
              href={service.link}
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;