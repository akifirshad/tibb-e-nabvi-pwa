// service-worker v2 - smart caching with version check and update
const CACHE_NAME = 'tibb-pwa-v4-v1';
const APP_SHELL = [
  './ui_pwa_v4.html',
  './ui_pwa.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './service-worker.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(clients.claim());
});

// On fetch: network-first for data JSONs, cache-first for app shell
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // handle data files specially
  if(url.pathname.startsWith('/tibb-e-nabvi-pwa/data/') || url.pathname.endsWith('.json')){
    event.respondWith(
      fetch(event.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return resp;
      }).catch(()=> caches.match(event.request))
    );
    return;
  }
  // app shell: cache-first
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(r => {
      try{ caches.open(CACHE_NAME).then(cache => cache.put(event.request, r.clone())); }catch(e){}
      return r;
    })).catch(()=> caches.match('./ui_pwa_v4.html') )
  );
});
