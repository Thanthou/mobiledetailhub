/**
 * Service Worker for That Smart Site PWA
 * Provides caching for assets, offline functionality, and tenant-specific manifests
 */

const CACHE_NAME = 'tss-pwa-v1.0.1';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icons/logo.png'
];

// Cache tenant manifests separately with longer TTL
const MANIFEST_CACHE = 'tss-manifests-v1';
const MANIFEST_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
      // Service Worker installing
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Caching static assets
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
                  // Static assets cached successfully
        return self.skipWaiting();
      })
      .catch((_error) => {
        // Failed to cache static assets
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
      // Service Worker activating
  
  const validCaches = [CACHE_NAME, MANIFEST_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              // Deleting old cache
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Service Worker activated
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // Special handling for tenant manifests
  if (url.pathname.includes('/api/tenant-manifest/')) {
    event.respondWith(manifestCacheStrategy(event.request));
    return;
  }

  // API requests always go to network (don't cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Network first for HTML pages, cache first for assets
        if (event.request.destination === 'document') {
          return networkFirst(event.request);
        } else {
          return cacheFirst(event.request);
        }
      })
      .catch(() => {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

/**
 * Network first strategy - for HTML pages
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

/**
 * Cache first strategy - for static assets
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Asset unavailable', { status: 503 });
  }
}

/**
 * Manifest cache strategy - cache with TTL
 * Caches tenant manifests for 24 hours, then revalidates
 */
async function manifestCacheStrategy(request) {
  const cache = await caches.open(MANIFEST_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response exists and is still fresh
  if (cachedResponse) {
    const cachedTime = cachedResponse.headers.get('sw-cached-time');
    if (cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < MANIFEST_TTL) {
        return cachedResponse;
      }
    }
  }
  
  // Fetch fresh manifest
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone the response and add timestamp header
      const responseToCache = new Response(networkResponse.body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cached-time': Date.now().toString()
        }
      });
      
      await cache.put(request, responseToCache);
      return networkResponse;
    }
    
    // If network fails but we have cache, return stale cache
    return cachedResponse || networkResponse;
  } catch (error) {
    // Network error, return cached version if available
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
