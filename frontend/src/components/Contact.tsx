import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

interface ContactProps {
  header: {
    phone: string;
    location: string;
  };
  footer: {
    email: string;
  };
}

const Contact: React.FC<ContactProps> = ({ header, footer }) => {
  return (
    <section id="contact" className="bg-stone-700 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Contact Information and Service Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40">
            {/* Contact Information */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left w-48">
                    <h3 className="font-semibold text-white">Phone</h3>
                    <a href={`tel:${header.phone}`} className="text-orange-500 hover:text-orange-400 text-lg">
                      {header.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left w-48">
                    <h3 className="font-semibold text-white">Location</h3>
                    <p className="text-orange-500 text-lg">{header.location}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left w-48">
                    <h3 className="font-semibold text-white">Email</h3>
                    <a href={`mailto:${footer.email}`} className="text-orange-500 hover:text-orange-400 text-lg">
                      {footer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-bold text-white mb-4">Service Areas</h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-orange-500">
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Bullhead City, AZ</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Laughlin, NV</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Kingman, AZ</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fort Mohave, AZ</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Needles, CA</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Lake Havasu City, AZ</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                Don't see your area? Give us a call - we may still be able to help!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 