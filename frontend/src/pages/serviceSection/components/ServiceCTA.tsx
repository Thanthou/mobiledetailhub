import type { ServicePageProps } from '../types';

export const ServiceCTA = ({ serviceData }: ServicePageProps) => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {serviceData.cta.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          {serviceData.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={serviceData.cta.buttonLink}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {serviceData.cta.buttonText}
          </a>
          <a
            href="/contact"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};
