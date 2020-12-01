// Subhankar Pal | @subho57
const CACHE_NAME = 'text-to-handwriting-v1'; // increment this when updating the web site
const urlsToCache = [
    'css/features.css',
    'css/index.css',
    'fonts/Hindi_Type.ttf',
    'images/android-chrome-192x192.png',
    'images/android-chrome-512x512.png',
    'images/apple-touch-icon.png',
    'images/dropdown-white.svg',
    'images/dropdown.svg',
    'images/favicon-16x16.png',
    'images/favicon-32x32-3.png',
    'images/favicon-32x32.png',
    'images/favicon.ico',
    'images/moon.svg',
    'images/sun.svg',
    'js/utils/draw.mjs',
    'js/utils/generate-utils.mjs',
    'js/utils/helpers.mjs',
    'js/vendors/html2canvas.min.js',
    'js/app.mjs',
    'js/generate-images.mjs',
    'tests/generateImage.spec.js',
    './.eslintignore',
    './.eslintrc.js',
    './.gitignore',
    './.prettierignore',
    './.prettierrc',
    './CODE_OF_CONDUCT.md',
    './CONTRIBUTING.md',
    './cypress.json',
    './index.html',
    './LICENSE',
    './manifest.webmanifest',
    './package-lock.json',
    './package.json',
    './README.md',
    './sample.jpeg',
    './sw.js'
];

const self = this;

// Install SW
self.addEventListener('install', (event) => {
    // start caching assets
    console.log('Installing service worker...')
    event.waitUntil(
        // open a new cache space
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker Installed!!');

            return cache.addAll(urlsToCache);
        })
    );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => caches.match('index.html'));
        })
    );
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    // Subhankar Pal | @subho57
    event.waitUntil(
        // delete any other cache which is not the current version
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});