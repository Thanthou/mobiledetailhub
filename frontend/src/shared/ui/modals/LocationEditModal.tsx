import React from 'react';

import { Modal } from './Modal';

interface LocationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: string) => void;
  currentLocation?: string;
}

const LocationEditModal: React.FC<LocationEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLocation = ''
}) => {
  const [location, setLocation] = React.useState(currentLocation);

  const handleSave = () => {
    onSave(location);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Location"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => { setLocation(e.target.value); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your location"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LocationEditModal;
