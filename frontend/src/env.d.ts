/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />

// Ensure `window.google` is strongly typed
declare global {
  interface Window {
    google?: typeof google;
  }
}

export {};
