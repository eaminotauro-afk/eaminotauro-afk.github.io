const CACHE_NAME = 'darryn-v3-31';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './intro-splash.mp4',
  './assets/tutorial/01_tareas.png', './assets/tutorial/02_cuentas.png', './assets/tutorial/03_jornada.png',
  './assets/tutorial/04_closet.png', './assets/tutorial/05_visual.png', './assets/tutorial/06_ciclo.png',
  './assets/tutorial/07_recuerdos.png', './assets/tutorial/08_musica.png', './assets/tutorial/09_habitos.png',
  './assets/tutorial/10_recordatorios.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Red primero (para que las actualizaciones lleguen solas), con respaldo en caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
