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
        '/pages/admin.html',
        '/pages/lessons.html',
        '/styles/main.css',
        '/styles/theme.css',
        '/scripts/app.js',
        '/scripts/events.js',
        '/scripts/profile.js',
        '/scripts/auth.js',
        '/scripts/search.js',
        '/components/sidebar.js',
        '/assets/images/ulic-favicon-192.png',
        '/assets/images/ulic-favicon-512.png',
        '/assets/images/ulic-hero-banner.jpg',
        '/assets/images/ulic-logo.ico',
        '/assets/fonts/Blanka.otf'
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