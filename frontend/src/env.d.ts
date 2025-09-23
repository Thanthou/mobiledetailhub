/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_ENABLE_SW?: '0' | '1';
  // Add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ensure `window.google` is strongly typed
declare global {
  interface Window {
    google?: typeof google;
  }
}

export {};
