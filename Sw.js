 // ============================================================
//  Ritmo Mental — Service Worker
//  Estrategia: Cache-first para assets, Network-first para HTML
// ============================================================

const CACHE_NAME = 'ritmo-mental-v1';

// Archivos que se guardan en caché al instalar la app
const PRECACHE_ASSETS = [
  '/',
  '/ritmo-mental.html',
  '/ritmo-mental.css',
  '/ritmo-mental.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Fuentes de Google (se cachean en primera visita)
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Lora:wght@400;600&display=swap'
];

// ── INSTALL: precachear todos los assets ─────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar cachés antiguas ────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estrategia según tipo de recurso ──────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones que no sean GET o que sean extensiones de navegador
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // HTML → Network-first (siempre intentar la versión más nueva)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // CSS, JS, imágenes, fuentes → Cache-first (rápido y offline)
  event.respondWith(cacheFirst(request));
});

// ── Estrategia Network-first ─────────────────────────────────
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match('/ritmo-mental.html');
  }
}

// ── Estrategia Cache-first ───────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    // Si es una imagen y no hay caché, devolver respuesta vacía sin romper
    if (request.destination === 'image') {
      return new Response('', { status: 200 });
    }
    return new Response('Sin conexión', { status: 503 });
  }
}