import { AlertTriangle, Trash2,X } from 'lucide-react';
import React from 'react';

import type { ServiceArea } from '../types';

interface DeleteLocationModalProps {
  isOpen: boolean;
  location: ServiceArea | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteLocationModal: React.FC<DeleteLocationModalProps> = ({
  isOpen,
  location,
  onClose,
  onConfirm,
  isDeleting = false
}) => {
  if (!isOpen || !location) return null;

  const formatLocation = () => {
    const parts = [location.city, location.state];
    if (location.zip) {
      parts.push(location.zip);
    }
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Delete Location</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete this service location?
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{location.city}</p>
                  <p className="text-xs text-gray-500">{formatLocation()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <div className="flex">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. Customers in this area will no longer be able to find your services.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { void onConfirm(); }}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-md transition-colors flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Location</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
