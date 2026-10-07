// ============================================================================
// Zaki Code - Advanced Progressive Web App Service Worker (v4)
// Offline Caching & Course Assets Pre-caching System
// ============================================================================

const CACHE_VERSION = 'v6';
const SHELL_CACHE = `zakicode-shell-${CACHE_VERSION}`;
const COURSE_CACHE = `zakicode-course-${CACHE_VERSION}`;
const FONTS_CACHE = `zakicode-fonts-${CACHE_VERSION}`;

// Core static assets required for the offline application shell
const CORE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon.ico',
  '/splash/apple_splash_portrait.png',
  '/splash/splash_landscape.png',
];

// External assets that can be pre-cached (e.g. Google Fonts)
const EXTERNAL_CORE_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap',
];

// Install Event: Precache core shell, icons, and discovery of bundled scripts/styles
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Precache App Shell with resilient Promise.allSettled
      const shellCache = await caches.open(SHELL_CACHE);
      try {
        await Promise.allSettled(
          CORE_SHELL_ASSETS.map((asset) =>
            shellCache.add(asset).catch((err) => {
              console.warn(`PWA: Could not pre-cache asset ${asset}:`, err);
            })
          )
        );
      } catch (err) {
        console.warn('PWA: Error during core shell caching:', err);
      }

      // 2. Discover and Precache production hashed bundles from /index.html
      try {
        const shell = await shellCache.match('/index.html');
        if (shell) {
          const html = await shell.text();
          const assetMatches = [
            ...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/g),
          ];
          const courseAssets = assetMatches
            .map((match) => new URL(match[1], self.location.origin))
            .filter((url) => url.origin === self.location.origin)
            .map((url) => `${url.pathname}${url.search}`);

          if (courseAssets.length > 0) {
            const courseCache = await caches.open(COURSE_CACHE);
            await courseCache.addAll(courseAssets);
          }
        }
      } catch (err) {
        console.warn('PWA: Failed to parse and precache bundle assets:', err);
      }

      // 3. Precache Google Fonts CSS
      try {
        const fontsCache = await caches.open(FONTS_CACHE);
        for (const fontUrl of EXTERNAL_CORE_ASSETS) {
          const req = new Request(fontUrl, { mode: 'no-cors' });
          fetch(req).then((res) => fontsCache.put(fontUrl, res)).catch(() => {});
        }
      } catch (err) {
        // Non-blocking
      }
    })()
  );
  // Force activate new service worker immediately
  self.skipWaiting();
});

// Activate Event: Clear outdated caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const activeCaches = [SHELL_CACHE, COURSE_CACHE, FONTS_CACHE];
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (!activeCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })()
  );
  self.clients.claim();
});

// Listen for background precaching messages from the app (e.g. course chapters)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_COURSE_ASSETS' && Array.isArray(event.data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(COURSE_CACHE);
        for (const url of event.data.urls) {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url);
              if (res.ok) {
                await cache.put(url, res);
              }
            }
          } catch {
            // Ignore offline or failure to fetch specific pre-cache asset
          }
        }
      })()
    );
  }
});

// Fetch Event: Multi-tiered caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Bypass non-GET requests and dynamic backend APIs (always live / real-time)
  if (request.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Navigation Request (HTML Pages) -> Network-first with cache fallback to /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(SHELL_CACHE);
            cache.put('/index.html', networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const cachedShell = await caches.match('/index.html');
          if (cachedShell) return cachedShell;
          const fallback = await caches.match('/');
          if (fallback) return fallback;
          return new Response('المنصة تعمل دون إنترنت (Offline Mode). يرجى فتح التطبيق مجدداً.', {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // 3. Google Fonts & Fonts Static CDN -> Cache First with background refresh
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      (async () => {
        const fontsCache = await caches.open(FONTS_CACHE);
        const cachedResponse = await fontsCache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            fontsCache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cachedResponse || new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // 4. Static and Dynamic Course Assets (JS chunks, CSS, Icons, JSON data)
  // For hashed assets (/assets/*.js), Cache-First; for others, Stale-While-Revalidate
  const isHashedAsset = url.pathname.startsWith('/assets/') || url.pathname.includes('-');
  
  event.respondWith(
    (async () => {
      const courseCache = await caches.open(COURSE_CACHE);
      const shellCache = await caches.open(SHELL_CACHE);

      // Check if already in cache
      const cachedResponse = (await courseCache.match(request)) || (await shellCache.match(request));

      // If it's an immutable hashed build asset and we have it cached, return immediately
      if (cachedResponse && isHashedAsset) {
        return cachedResponse;
      }

      // Fetch from network with cache update
      try {
        const networkResponse = await fetch(request);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const clone = networkResponse.clone();
          courseCache.put(request, clone);
        }
        return networkResponse;
      } catch (err) {
        // When network fails, return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return a benign offline 503 response if not found
        return new Response('محتوى غير متوفر دون إنترنت', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })()
  );
});
