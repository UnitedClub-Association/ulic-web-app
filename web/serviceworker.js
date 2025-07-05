self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('ulic-cache-v1').then(cache => {
      return cache.addAll([
        '/pages/home.html',
        '/pages/login.html',
        '/pages/events.html',
        '/pages/calendar.html',
        '/pages/projects.html',
        '/pages/profile.html',
        '/styles/main.css',
        '/styles/theme.css',
        '/scripts/app.js',
        '/assets/images/ulic-favicon-192.png',
        '/assets/images/ulic-favicon-512.png',
        '/assets/images/ulic-hero-banner.jpg',
        '/assets/images/ulic-logo.ico'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});