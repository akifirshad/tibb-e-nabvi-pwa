
const CACHE_NAME = 'tibb-cache-v1';
const FILES_TO_CACHE = [
  './ui_pwa.html',
  './manifest.json',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((resp) => {
      return resp || fetch(evt.request).then((r) => {
        try{ caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, r.clone())); }catch(e){}
        return r;
      }).catch(()=> caches.match('./ui_pwa.html'));
    })
  );
});
