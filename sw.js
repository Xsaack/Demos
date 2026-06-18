// Service Worker — Finances Gaxiola
// Estrategia: network-first para el HTML (siempre la versión más nueva
// si hay internet), con respaldo en caché solo para uso sin conexión.
// Se auto-activa y reemplaza versiones viejas para que la app instalada
// nunca quede "congelada" en una versión anterior.

const CACHE_NAME = 'finanzas-gaxiola-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
