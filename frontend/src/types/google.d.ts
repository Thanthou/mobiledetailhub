export {};

declare global {
  namespace google.maps.places {
    interface Place {
      addressComponents?: Array<{ 
        longText?: string; 
        shortText?: string; 
        types?: string[] 
      }>;
      id?: string;
      displayName?: { text?: string };
    }
  }
}
