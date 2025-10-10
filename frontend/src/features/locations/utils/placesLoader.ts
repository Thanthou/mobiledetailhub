/* eslint-disable @typescript-eslint/no-unnecessary-condition -- Google Maps API checks require optional chaining that TypeScript thinks is unnecessary */
// A small, typed loader around the new importLibrary('places') API.

const MAPS_SRC_MATCH = 'maps.googleapis.com';

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

/** Ensures the <script> is present; returns once it finishes loading or errors. */
async function injectMapsScript(): Promise<void> {
  if (window.google?.maps) return; // already loaded
  if (!document.querySelector(`script[src*="${MAPS_SRC_MATCH}"]`)) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey) throw new Error('Missing VITE_GOOGLE_MAPS_API_KEY');

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta&loading=async`;
    script.async = true;
    script.defer = true;

    // Wrap load/error in a promise
    await new Promise<void>((resolve, reject) => {
      script.onload = () => { resolve(); };
      script.onerror = () => { reject(new Error('Failed to load Google Maps JS API')); };
      document.head.appendChild(script);
    });
  } else {
    // A script tag exists; give it a moment to finish if needed
    // (helps in Fast Refresh / quick reload flows)
    for (let i = 0; i < 20 && !window.google?.maps; i++) {
      await wait(100);
    }
  }
}

/** Loads the Places library (typed) or returns null if not available yet. */
export async function importPlacesLib(): Promise<google.maps.PlacesLibrary | null> {
  await injectMapsScript();

  const g = window.google;
  if (!g?.maps?.importLibrary) return null;

  const lib = await g.maps.importLibrary('places') as google.maps.PlacesLibrary;
  return lib;
}

/** Convenience "is ready?" probe */
export async function ensurePlacesReady(): Promise<boolean> {
  const lib = await importPlacesLib();
  return !!lib;
}
/* eslint-enable @typescript-eslint/no-unnecessary-condition -- Re-enable after Google Maps API checks */
