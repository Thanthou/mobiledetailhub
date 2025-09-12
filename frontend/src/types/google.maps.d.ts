// Google Maps API type definitions
export {};

declare global {
  const google: typeof import('@types/google.maps') extends infer T
    ? T extends object
      ? T // Use the actual types if available
      : {
          maps: {
            importLibrary: (library: string) => Promise<unknown>;
            [key: string]: unknown;
          };
        }
    : {
        maps: {
          importLibrary: (library: string) => Promise<unknown>;
          [key: string]: unknown;
        };
      };

  interface Window {
    google?: typeof google;
  }
}