import { affiliateServesLocation, getPrimaryServiceArea, getAffiliateDisplayLocation } from '../affiliateLocationHelper';
import { LocationData } from '../../contexts/LocationContext';

// Test data based on the seed data
const testServiceAreas = [
  {
    city: "Phoenix",
    state: "AZ",
    primary: true
  },
  {
    city: "Scottsdale", 
    state: "AZ",
    zip: "85251"
  },
  {
    city: "Tempe",
    state: "AZ", 
    zip: "85281"
  }
];

const testLocationData: LocationData = {
  city: "Phoenix",
  state: "AZ",
  zipCode: "85001",
  fullLocation: "Phoenix, AZ"
};

const testLocationDataNotServed: LocationData = {
  city: "Tucson",
  state: "AZ", 
  zipCode: "85701",
  fullLocation: "Tucson, AZ"
};

describe('affiliateLocationHelper', () => {
  describe('affiliateServesLocation', () => {
    it('should return true when affiliate serves the location', () => {
      const result = affiliateServesLocation(testServiceAreas, testLocationData);
      expect(result).toBe(true);
    });

    it('should return false when affiliate does not serve the location', () => {
      const result = affiliateServesLocation(testServiceAreas, testLocationDataNotServed);
      expect(result).toBe(false);
    });

    it('should return false when location is null', () => {
      const result = affiliateServesLocation(testServiceAreas, null);
      expect(result).toBe(false);
    });

    it('should handle string service areas', () => {
      const stringServiceAreas = JSON.stringify(testServiceAreas);
      const result = affiliateServesLocation(stringServiceAreas, testLocationData);
      expect(result).toBe(true);
    });
  });

  describe('getPrimaryServiceArea', () => {
    it('should return the primary service area', () => {
      const result = getPrimaryServiceArea(testServiceAreas);
      expect(result).toEqual({
        city: "Phoenix",
        state: "AZ", 
        primary: true
      });
    });

    it('should return null when no primary area exists', () => {
      const noPrimaryAreas = [
        { city: "Scottsdale", state: "AZ" },
        { city: "Tempe", state: "AZ" }
      ];
      const result = getPrimaryServiceArea(noPrimaryAreas);
      expect(result).toBeNull();
    });
  });

  describe('getAffiliateDisplayLocation', () => {
    it('should return selected location when affiliate serves it', () => {
      const result = getAffiliateDisplayLocation(testServiceAreas, testLocationData);
      expect(result).toEqual({
        city: "Phoenix",
        state: "AZ",
        fullLocation: "Phoenix, AZ"
      });
    });

    it('should return primary location when selected location is not served', () => {
      const result = getAffiliateDisplayLocation(testServiceAreas, testLocationDataNotServed);
      expect(result).toEqual({
        city: "Phoenix", 
        state: "AZ",
        fullLocation: "Phoenix, AZ"
      });
    });

    it('should return primary location when no location is selected', () => {
      const result = getAffiliateDisplayLocation(testServiceAreas, null);
      expect(result).toEqual({
        city: "Phoenix",
        state: "AZ", 
        fullLocation: "Phoenix, AZ"
      });
    });

    it('should return null when no service areas exist', () => {
      const result = getAffiliateDisplayLocation(null, testLocationData);
      expect(result).toBeNull();
    });
  });
});
