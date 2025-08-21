import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import ContactItem from '../ContactItem';
import LocationEditModal from '../../shared/LocationEditModal';

interface ContactInfoColumnProps {
  businessInfo: {
    phone: string;
    email: string;
    address: string;
  };
  onRequestQuote?: () => void;
}

const ContactInfoColumnMDH: React.FC<ContactInfoColumnProps> = ({ businessInfo, onRequestQuote }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white">Get In Touch</h2>
      
      <div className="space-y-6 mt-6">
        <ContactItem icon={Phone} title="Phone">
          <span className="text-orange-500 text-lg">
            {businessInfo.phone}
          </span>
        </ContactItem>

        <ContactItem icon={Mail} title="Email">
          <button 
            onClick={onRequestQuote}
            className="text-orange-500 hover:text-orange-400 text-lg hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
          >
            {businessInfo.email}
          </button>
        </ContactItem>

        <ContactItem icon={MapPin} title="Location">
          <button 
            onClick={() => {
              // Open location search modal for MDH
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]';
              modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                  <h3 class="text-lg font-semibold mb-4">Enter New Location</h3>
                  <input 
                    type="text" 
                    placeholder="Enter your city or zip code" 
                    class="w-full p-2 border border-gray-300 rounded mb-4"
                    id="location-input"
                  />
                  <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">Cancel</button>
                    <button class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onclick="handleLocationSubmit()">Search</button>
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
              
              // Handle location submission
              window.handleLocationSubmit = () => {
                const input = document.getElementById('location-input') as HTMLInputElement;
                const location = input.value.trim();
                if (location) {
                  // Route to affiliate site with location
                  window.location.href = `/?city=${encodeURIComponent(location)}`;
                }
                modal.remove();
              };
            }}
            className="text-orange-500 hover:text-orange-400 text-lg hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
          >
            Anywhere, USA
          </button>
        </ContactItem>
      </div>
    </div>
  );
};

export default ContactInfoColumnMDH;
