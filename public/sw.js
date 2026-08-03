const CACHE_NAME = 'mis-ingresos-uber-v1';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Si falla, continúa sin cachear offline
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo cachear GET
  if (request.method !== 'GET') {
    return;
  }

  // APIs: network-first (intenta conectar primero)
  if (request.url.includes('/api/')) {
    return event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: 'Sin conexión. Los datos en línea no están disponibles.',
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
  }

  // Otros: cache-first (usa lo cacheado si está disponible)
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
