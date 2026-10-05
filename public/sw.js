const CACHE_NAME = 'zakicode-pwa-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);

      // Precache the hashed entry module and stylesheet so the app shell can
      // start when the user loses connectivity immediately after installing.
      const shell = await cache.match('/index.html');
      const html = shell ? await shell.text() : '';
      const assets = [...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g)]
        .map((match) => new URL(match[1], self.location.origin))
        .filter((url) => url.origin === self.location.origin)
        .map((url) => `${url.pathname}${url.search}`);

      if (assets.length) await cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Don't intercept non-GET or API requests
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  // Network First with Cache Fallback strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful local GET responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If HTML navigation, return offline index
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('محتوى غير متوفر دون إنترنت', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        });
      })
  );
});
