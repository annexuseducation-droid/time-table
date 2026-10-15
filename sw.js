const CACHE_NAME = 'timetable-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Event - Caching App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve from Cache when Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Push / Notification Event Listener
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Upcoming Lecture', body: 'You have a scheduled class starting soon.' };
  
  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now() }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});