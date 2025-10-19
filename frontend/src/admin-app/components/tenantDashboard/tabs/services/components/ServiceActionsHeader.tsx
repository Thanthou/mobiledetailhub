/**
 * Action buttons header for service management
 */

import React from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui';

interface ServiceActionsHeaderProps {
  onEditService: () => void;
  onAddService: () => void;
  onDeleteService: () => void;
  hasSelectedService: boolean;
}

export const ServiceActionsHeader: React.FC<ServiceActionsHeaderProps> = ({
  onEditService,
  onAddService,
  onDeleteService,
  hasSelectedService
}) => {
  return (
    <div className="p-4 border-b border-stone-700">
      <div className="grid grid-cols-[200px_200px_200px_auto] gap-0">
        <h3 className="text-lg font-semibold text-white px-4">Vehicle</h3>
        <h3 className="text-lg font-semibold text-white px-4">Category</h3>
        <h3 className="text-lg font-semibold text-white px-4">Service</h3>
        <div className="flex items-center justify-end space-x-2">
          <Button 
            variant="ghost"
            size="icon"
            className="p-2 text-gray-400 hover:text-white"
            title="Edit Service"
            onClick={onEditService}
            disabled={!hasSelectedService}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="primary"
            size="icon"
            className="p-2 bg-green-500 hover:bg-green-600"
            title="Add Service"
            onClick={onAddService}
            leftIcon={<Plus className="h-5 w-5" />}
          />
          <Button 
            variant="destructive"
            size="icon"
            className="p-2 bg-red-500 hover:bg-red-600"
            title="Delete Service"
            onClick={onDeleteService}
            disabled={!hasSelectedService}
            leftIcon={<Trash2 className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
};

