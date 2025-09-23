import React, { useState } from 'react';
import { useBookingData } from '@/features/booking/state';

const StepLocation: React.FC = () => {
  const { bookingData, setLocation } = useBookingData();
  const [address, setAddress] = useState(bookingData.location?.address || '');
  const [city, setCity] = useState(bookingData.location?.city || '');
  const [state, setState] = useState(bookingData.location?.state || '');
  const [zip, setZip] = useState(bookingData.location?.zip || '');
  const [notes, setNotes] = useState(bookingData.location?.notes || '');

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setLocation({ ...bookingData.location, address: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setLocation({ ...bookingData.location, city: e.target.value });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
    setLocation({ ...bookingData.location, state: e.target.value });
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZip(e.target.value);
    setLocation({ ...bookingData.location, zip: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setLocation({ ...bookingData.location, notes: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={handleAddressChange}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={handleCityChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={handleStateChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={zip}
              onChange={handleZipChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
        
        <div>
          <textarea
            placeholder="Special notes (optional)"
            value={notes}
            onChange={handleNotesChange}
            rows={5}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StepLocation;
