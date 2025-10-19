import { describe, expect,it } from 'vitest';

import { 
  getAvailableFolderNames, 
  getAvailableVehicleTypes, 
  isValidVehicleType, 
  toFolderName, 
  VEHICLE_FOLDER_MAP} from '@/shared/constants/vehicleMapping';

describe('vehicleMapping', () => {
  describe('VEHICLE_FOLDER_MAP', () => {
    it('should contain all expected vehicle types', () => {
      expect(VEHICLE_FOLDER_MAP).toEqual({
        'car': 'cars',
        'truck': 'trucks',
        'suv': 'suvs',
        'boat': 'boats',
        'rv': 'rvs'
      });
    });
  });

  describe('toFolderName', () => {
    it('should return correct folder name for valid vehicle types', () => {
      expect(toFolderName('car')).toBe('cars');
      expect(toFolderName('truck')).toBe('trucks');
      expect(toFolderName('suv')).toBe('suvs');
      expect(toFolderName('boat')).toBe('boats');
      expect(toFolderName('rv')).toBe('rvs');
    });

    it('should return null for invalid vehicle types', () => {
      expect(toFolderName('invalid')).toBeNull();
      expect(toFolderName('')).toBeNull();
      expect(toFolderName('CAR')).toBeNull(); // case sensitive
    });
  });

  describe('isValidVehicleType', () => {
    it('should return true for valid vehicle types', () => {
      expect(isValidVehicleType('car')).toBe(true);
      expect(isValidVehicleType('truck')).toBe(true);
      expect(isValidVehicleType('suv')).toBe(true);
      expect(isValidVehicleType('boat')).toBe(true);
      expect(isValidVehicleType('rv')).toBe(true);
    });

    it('should return false for invalid vehicle types', () => {
      expect(isValidVehicleType('invalid')).toBe(false);
      expect(isValidVehicleType('')).toBe(false);
      expect(isValidVehicleType('CAR')).toBe(false); // case sensitive
    });
  });

  describe('getAvailableVehicleTypes', () => {
    it('should return all vehicle types', () => {
      const types = getAvailableVehicleTypes();
      expect(types).toEqual(['car', 'truck', 'suv', 'boat', 'rv']);
      expect(types).toHaveLength(5);
    });
  });

  describe('getAvailableFolderNames', () => {
    it('should return all folder names', () => {
      const folders = getAvailableFolderNames();
      expect(folders).toEqual(['cars', 'trucks', 'suvs', 'boats', 'rvs']);
      expect(folders).toHaveLength(5);
    });
  });
});
