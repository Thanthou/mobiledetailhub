/// <reference types="@types/google.maps" />

export {};

declare global {
  const google: typeof globalThis.google;
}