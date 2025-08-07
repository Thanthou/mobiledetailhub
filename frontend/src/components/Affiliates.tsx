import React from 'react';
import { Shield, Zap, Droplets, Sparkles, Star, Award } from 'lucide-react';

const Affiliates: React.FC = () => {
  const brands = [
    { 
      image: '/koch.png',
      color: 'bg-black',
      url: 'https://www.koch-chemie.com'
    },
    { 
      image: '/starke.png',
      color: 'bg-black',
      url: 'https://starkeyachtcare.com/'
    },
    { 
      image: '/menzerna.webp',
      color: 'bg-black',
      url: 'https://www.menzerna.com'
    },
    { 
      image: '/underdog.webp',
      color: 'bg-black',
      url: 'https://getundrdog.com/.com'
    },
    { 
      image: '/mirka.webp',
      color: 'bg-black',
      url: 'https://www.mirka.com'
    },
    { 
      image: '/rupes.png',
      color: 'bg-black',
      url: 'https://www.rupes.com'
    },
    { 
      image: '/mtm_hydro.jpg',
      color: 'bg-black',
      url: 'https://www.mtmhydroparts.com/'
    },
    { 
      image: '/yot-stik.webp',
      color: 'bg-black',
      url: 'https://www.yotstik.com/'
    },
    { 
      image: '/auto-fiber.webp',
      color: 'bg-black',
      url: 'https://www.autofiber.com/'
    },
  ];

  return (
    <section className="bg-stone-800 py-28">
      <div className="w-full">
       
        <div className="flex justify-center items-center gap-4">
          {brands.map((brand, index) => (
            <a
              key={index}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
                             <div className={`w-40 h-40 ${brand.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl overflow-hidden`}>
                 <img 
                   src={brand.image} 
                                       className={`w-full h-full ${
                      brand.image.includes('koch.png') ? 'object-contain scale-125' :
                      brand.image.includes('underdog.webp') ? 'object-contain scale-90' : 
                      brand.image.includes('mirka.webp') ? 'object-contain scale-150' : 
                      brand.image.includes('menzerna.webp') ? 'object-contain scale-100' : 
                      brand.image.includes('mtm_hydro.jpg') ? 'object-contain scale-75' :
                      brand.image.includes('yot-stik.webp') ? 'object-contain scale-90' :
                      brand.image.includes('auto-fiber.webp') ? 'object-contain scale-150' :
                      brand.image.includes('rupes.png') ? 'object-contain scale-100' : 'object-cover'
                    }`}
                 />
               </div>
                             <span className="text-gray-300 text-sm mt-3 font-medium group-hover:text-white transition-colors">
               </span>
             </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Affiliates; 