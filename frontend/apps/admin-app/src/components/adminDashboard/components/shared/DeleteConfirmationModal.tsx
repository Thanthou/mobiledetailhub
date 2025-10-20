import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@shared/ui';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  isLoading?: boolean;
  isTenant?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  isTenant = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">
              {title}
            </h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            {message}
          </p>
          
          <div className="bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-white font-medium">
              {itemName}
            </p>
          </div>

          {isTenant && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-red-200 text-sm font-medium mb-2">⚠️ This will permanently delete:</p>
              <ul className="text-red-300 text-xs space-y-1 ml-4">
                <li>• Tenant business record</li>
                <li>• User account</li>
                <li>• All reviews</li>
                <li>• Website content</li>
                <li>• Images and gallery</li>
                <li>• Services and pricing</li>
                <li>• Bookings and quotes</li>
                <li>• Schedule and appointments</li>
                <li>• Subscriptions</li>
                <li>• Health monitoring data</li>
              </ul>
            </div>
          )}

          <p className="text-red-400 text-sm font-medium">
            This action cannot be undone!
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

