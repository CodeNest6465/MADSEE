const cacheName = 'site-cache-v1'
const assetsToCache = [
"/",
"/index.html",

]
    self.addEventListener('install', (event) => {
    event.waitUntil (
        caches.open(cacheName).then ((cache) => {
            return cache.addAll(assetsToCache);
         })
        );
    });

    self.addEventListener('activate', (event) => {
        event.waitUntil (
            caches.open(cacheName).then ((cache) => {
                return cache.addAll(assetsToCache);
             })
            );
        });
        