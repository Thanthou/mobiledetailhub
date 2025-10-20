import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@shared/ui';

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  loading: boolean;
}

export const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg p-6 max-w-md w-full mx-4 border border-stone-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-white">Delete Service</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{serviceName}&rdquo;</span>? 
          This action cannot be undone and will remove all associated service tiers.
        </p>
        
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
            className="flex-1 px-4 py-2 text-gray-300 border-gray-600 hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            size="md"
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700"
            loading={loading}
            disabled={loading}
          >
            Delete Service
          </Button>
        </div>
      </div>
    </div>
  );
};
