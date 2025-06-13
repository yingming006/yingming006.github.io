const CACHE_NAME = 'time-clock-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/apple-touch-icon.png',
  '/img/favicon-96x96.png',
  '/img/favicon.ico',
  '/img/favicon.svg',
  '/img/web-app-manifest-192x192.png',
  '/img/web-app-manifest-512x512.png',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200..900&display=swap',
  'https://fonts.googleapis.com/css2?family=Signika:wght@300..700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});