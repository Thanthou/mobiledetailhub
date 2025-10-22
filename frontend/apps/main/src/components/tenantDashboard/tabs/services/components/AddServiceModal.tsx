import React, { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@shared/ui';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceTitle: string) => void;
  vehicleName: string;
  categoryName: string;
  loading?: boolean;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicleName,
  categoryName,
  loading = false
}) => {
  const [serviceTitle, setServiceTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceTitle.trim()) {
      onSubmit(serviceTitle.trim());
      setServiceTitle('');
    }
  };

  const handleClose = () => {
    setServiceTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg border border-stone-700 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Add New Service</h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">
            Adding service to: <span className="text-white font-medium">{vehicleName} - {categoryName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="serviceTitle" className="block text-sm font-medium text-gray-300 mb-2">
              Service Title
            </label>
            <input
              type="text"
              id="serviceTitle"
              value={serviceTitle}
              onChange={(e) => { setServiceTitle(e.target.value); }}
              className="w-full px-3 py-2 bg-stone-700 border border-stone-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter service title..."
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              size="md"
              className="flex-1 px-4 py-2 bg-stone-600 hover:bg-stone-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600"
              loading={loading}
              disabled={loading || !serviceTitle.trim()}
            >
              Create Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
