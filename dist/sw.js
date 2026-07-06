const CACHE_VERSION = 'bagsandbeyond-v3';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const APP_SHELL = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/pwa-icon.svg',
  '/manifest.webmanifest'
];

const API_PATH_PREFIXES = ['/api/'];
const CHECKOUT_PATHS = ['/checkout', '/order-success', '/orders', '/track-order', '/admin'];

const isApiRequest = (url) => {
  if (API_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return true;
  return url.port === '5000' || url.pathname.includes('/api/');
};

const isCheckoutLikeNavigation = (url) => CHECKOUT_PATHS.some((path) => url.pathname.startsWith(path));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith('bagsandbeyond-') && !key.startsWith(CACHE_VERSION))
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const isHttpRequest = url.protocol === 'http:' || url.protocol === 'https:';

  if (!isHttpRequest) {
    return;
  }

  if (request.method !== 'GET' || isApiRequest(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage && !isCheckoutLikeNavigation(url)) return cachedPage;
          return caches.match('/offline.html');
        })
    );
    return;
  }

  if (['style', 'script', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
  }
});
