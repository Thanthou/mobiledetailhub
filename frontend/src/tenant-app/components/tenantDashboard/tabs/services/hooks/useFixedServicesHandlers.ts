import { useCallback, useState } from 'react';

import type { Service } from '../types';

interface UseFixedServicesHandlersProps {
  availableServices: Service[];
  selectedService: string;
  currentServiceData: Service | null;
  setSelectedService: (id: string) => void;
  setCurrentServiceData: (service: Service | null) => void;
  setAvailableServices: (services: Service[]) => void;
  updateService: (id: string, data: unknown) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  createService: (data: unknown) => Promise<unknown>;
  fetchServices: (vehicle: string, category: string) => Promise<unknown>;
  selectedVehicle: string;
  selectedCategory: string;
}

export const useFixedServicesHandlers = ({
  availableServices,
  selectedService,
  currentServiceData,
  setSelectedService,
  setCurrentServiceData,
  setAvailableServices,
  updateService,
  deleteService,
  createService,
  fetchServices,
  selectedVehicle,
  selectedCategory,
}: UseFixedServicesHandlersProps) => {
  const [isMultiTierModalOpen, setIsMultiTierModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);

  const handleEditService = useCallback(() => {
    if (selectedService && currentServiceData) {
      setIsEditingService(true);
      setIsMultiTierModalOpen(true);
    }
  }, [selectedService, currentServiceData]);

  const handleServiceChange = useCallback((serviceId: string) => {
    setSelectedService(serviceId);
    const serviceData = availableServices.find(service => service.id === serviceId);
    if (serviceData) {
      setCurrentServiceData(serviceData);
    }
  }, [availableServices, setSelectedService, setCurrentServiceData]);

  const handleSaveService = useCallback(async (serviceData: unknown) => {
    if (isEditingService && selectedService) {
      // Update existing service
      const success = await updateService(selectedService, serviceData);
      if (success) {
        setIsMultiTierModalOpen(false);
        setIsEditingService(false);
        
        // Refresh services after a short delay to ensure DB has updated
        setTimeout(() => {
          void fetchServices(selectedVehicle, selectedCategory).then((data: unknown) => {
            if (data && Array.isArray(data)) {
              const services = data.map((service: unknown) => service as Service);
              setAvailableServices(services);
              const updatedService = services.find(s => s.id === selectedService);
              if (updatedService) {
                setCurrentServiceData(updatedService);
              }
            }
          });
        }, 500);
      }
    } else {
      // Create new service
      try {
        const newService = await createService(serviceData);
        if (newService) {
          setIsMultiTierModalOpen(false);
          setIsEditingService(false);
          
          // Refresh services after a short delay
          setTimeout(() => {
            void fetchServices(selectedVehicle, selectedCategory).then((data: unknown) => {
              if (data && Array.isArray(data)) {
                const services = data.map((service: unknown) => service as Service);
                setAvailableServices(services);
                
                if (services.length > 0) {
                  const newServiceData = services[0];
                  if (newServiceData) {
                    setCurrentServiceData(newServiceData);
                    setSelectedService(newServiceData.id);
                  }
                }
              }
            }).catch((err: unknown) => {
              console.error('Error refreshing services:', err);
            });
          }, 500);
        }
      } catch (err: unknown) {
        console.error('Error creating service:', err);
        setIsMultiTierModalOpen(false);
      }
    }
  }, [isEditingService, selectedService, updateService, createService, fetchServices, selectedVehicle, selectedCategory, setAvailableServices, setCurrentServiceData, setSelectedService]);

  const handleDeleteService = useCallback(async () => {
    if (!selectedService || !currentServiceData) return;
    
    try {
      const success = await deleteService(selectedService);
      if (success) {
        setIsDeleteServiceModalOpen(false);
        
        const updatedServices = availableServices.filter(service => service.id !== selectedService);
        setAvailableServices(updatedServices);
        setCurrentServiceData(null);
        setSelectedService('');
        
        if (updatedServices.length > 0) {
          const firstService = updatedServices[0];
          if (firstService) {
            setSelectedService(firstService.id);
            setCurrentServiceData(firstService);
          }
        }
      }
    } catch (err: unknown) {
      console.error('Error deleting service:', err);
    }
  }, [selectedService, currentServiceData, deleteService, availableServices, setAvailableServices, setCurrentServiceData, setSelectedService]);

  return {
    isMultiTierModalOpen,
    isDeleteServiceModalOpen,
    isEditingService,
    setIsMultiTierModalOpen,
    setIsDeleteServiceModalOpen,
    handleEditService,
    handleServiceChange,
    handleSaveService,
    handleDeleteService,
  };
};

