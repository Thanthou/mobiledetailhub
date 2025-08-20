
const SERVICES = [
  {
    title: 'Auto Detailing',
    image: '/assets/auto.png',
    link: '#',
  },
  {
    title: 'Marine Detailing',
    image: '/assets/boat.png',
    link: '#',
  },
  {
    title: 'RV Detailing',
    image: '/assets/rv.png',
    link: '#',
  },
  
  {
    title: 'Ceramic Coating',
    image: '/assets/ceramic.png',
    link: '#',
  },
  {
    title: 'Paint Correction',
    image: '/assets/paint_correction.png',
    link: '#',
  },
  {
    title: 'Paint Protection Film',
    image: '/assets/ppf.png',
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