import { useCallback, useState } from 'react';

import type { ServiceArea } from '../types';

export const useLocationState = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<ServiceArea | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  const toggleStateExpansion = useCallback((state: string) => {
    setExpandedStates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(state)) {
        newSet.delete(state);
      } else {
        newSet.add(state);
      }
      return newSet;
    });
  }, []);

  const expandAllStates = useCallback((stateNames: string[]) => {
    setExpandedStates(new Set(stateNames));
  }, []);

  const collapseAllStates = useCallback(() => {
    setExpandedStates(new Set());
  }, []);

  const openDeleteModal = useCallback((location: ServiceArea) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setLocationToDelete(null);
  }, []);

  const startEditingLocation = useCallback((locationId: string) => {
    setEditingLocationId(locationId);
  }, []);

  const stopEditingLocation = useCallback(() => {
    setEditingLocationId(null);
  }, []);

  return {
    // Modal state
    isAddModalOpen,
    setIsAddModalOpen,
    isDeleteModalOpen,
    locationToDelete,
    isDeleting,
    setIsDeleting,
    openDeleteModal,
    closeDeleteModal,
    
    // State expansion
    expandedStates,
    toggleStateExpansion,
    expandAllStates,
    collapseAllStates,
    
    // Location editing
    editingLocationId,
    startEditingLocation,
    stopEditingLocation,
  };
};
