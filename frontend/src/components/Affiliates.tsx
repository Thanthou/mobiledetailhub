import React from 'react';
import { Shield, Zap, Droplets, Sparkles, Star, Award } from 'lucide-react';

const Affiliates: React.FC = () => {
  const brands = [
    { 
      image: '/meguires.jpg',
      color: 'bg-black'
    },
    { 
      image: '/3m.png',
      color: 'bg-black'
    },
    { 
      image: '/griots.jpg',
      color: 'bg-black'
    },
    { 
      image: '/c6.webp',
      color: 'bg-black'
    },
    { 
      image: '/xpel.png',
      color: 'bg-black'
    },
    { 
      image: '/shopvac.jpg',
      color: 'bg-black'
    },
    { 
      image: '/chemicalguys.jpg',
      color: 'bg-black'
    },
    { 
      image: '/adams.webp',
      color: 'bg-black'
    },
    { 
      image: '/3d.png',
      color: 'bg-black'
    },
    { 
      image: '/carpro.png',
      color: 'bg-black'
    },
  ];

  return (
    <section className="bg-stone-800 py-28">
      <div className="w-full">
       
        <div className="flex justify-center items-center gap-4">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group flex flex-col items-center"
            >
                             <div className={`w-40 h-40 ${brand.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl overflow-hidden`}>
                 <img 
                   src={brand.image} 
                                       className={`w-full h-full ${
                      brand.image.includes('3m.png') ? 'object-contain scale-90' : 
                      brand.image.includes('griots.jpg') ? 'object-contain scale-100' : 
                      brand.image.includes('chemicalguys.jpg') ? 'object-contain scale-125' : 
                      brand.image.includes('adams.webp') ? 'object-contain scale-125' :
                      brand.image.includes('carpro.png') ? 'object-contain scale-125' :
                      brand.image.includes('c6.webp') ? 'object-contain scale-150' : 'object-cover'
                    }`}
                 />
               </div>
              <span className="text-gray-300 text-sm mt-3 font-medium group-hover:text-white transition-colors">
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Affiliates; 