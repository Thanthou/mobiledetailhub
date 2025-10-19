// Google Maps helper functions with proper typing

export function getGoogle(): (typeof google) | undefined {
  return (window as unknown as { google?: typeof google }).google;
}

export function hasImportLibrary(): boolean {
  const g = getGoogle();
  // v=beta exposes maps.importLibrary
  return !!g?.maps.importLibrary;
}

export function hasMaps(): boolean {
  const g = getGoogle();
  return !!g?.maps;
}
