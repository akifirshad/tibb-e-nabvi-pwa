// service-worker-v5 - versioned smart caching with update detection
const CACHE_NAME = 'tibb-pwa-v5-v1';
const APP_SHELL = [
  './ui_pwa_v5.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/scientist.png',
  './service-worker-v5.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // network-first for data JSONs
  if(url.pathname.includes('/data/') || url.pathname.endsWith('.json')){
    event.respondWith(fetch(event.request).then(resp => { caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone())); return resp; }).catch(()=> caches.match(event.request)));
    return;
  }
  // cache-first for app shell and assets
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request).then(r => { try{ caches.open(CACHE_NAME).then(cache => cache.put(event.request, r.clone())); }catch(e){} return r; })).catch(()=> caches.match('./ui_pwa_v5.html')));
});
