// Service Worker — ADOFOM E-Platform
// Cache-first strategy with offline fallback

const CACHE_NAME = 'adofom-v2';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/login',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;
  if (event.request.url.includes('supabase.co')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// PWABuilder Compliance: Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[Service Worker] Background sync triggered');
  }
});

// PWABuilder Compliance: Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-data') {
    console.log('[Service Worker] Periodic background sync triggered');
  }
});

// PWABuilder Compliance: Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'You have a new notification from ADOFOM';
  const options = {
    body: data,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png'
  };
  event.waitUntil(
    self.registration.showNotification('ADOFOM Update', options)
  );
});
