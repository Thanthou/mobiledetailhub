import React, { useState } from 'react';
import { useBookingData } from '@/features/booking/state';

const StepLocation: React.FC = () => {
  const { bookingData, setLocation } = useBookingData();
  const [address, setAddress] = useState(bookingData.location?.address || '');
  const [city, setCity] = useState(bookingData.location?.city || '');
  const [state, setState] = useState(bookingData.location?.state || '');
  const [zip, setZip] = useState(bookingData.location?.zip || '');
  const [notes, setNotes] = useState(bookingData.location?.notes || '');
  const [locationTypes, setLocationTypes] = useState<string[]>(bookingData.location?.locationType ? bookingData.location.locationType.split(',') : []);

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

  const handleLocationTypeChange = (type: string) => {
    const updatedTypes = locationTypes.includes(type)
      ? locationTypes.filter(t => t !== type) // Remove if already selected
      : [...locationTypes, type]; // Add if not selected
    
    setLocationTypes(updatedTypes);
    setLocation({ ...bookingData.location, locationType: updatedTypes.join(',') });
  };

  const availableLocationTypes = ['Garage', 'Driveway', 'Business', 'Hangar', 'Street', 'Other'];

  return (
    <div className="space-y-6">
      {/* Location Type Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-white font-medium text-lg">Please tell us where your vehicle will be serviced</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableLocationTypes.map((type) => (
            <label
              key={type}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                locationTypes.includes(type)
                  ? 'border-orange-500 bg-orange-500/20'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700'
              }`}
            >
              <input
                type="checkbox"
                value={type}
                checked={locationTypes.includes(type)}
                onChange={() => handleLocationTypeChange(type)}
                className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-white font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Address Fields */}
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
