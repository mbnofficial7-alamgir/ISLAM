const CACHE_NAME = "islam-app-v1";

const APP_FILES = [
    "./",
    "./index.html"
];

// অ্যাপের প্রয়োজনীয় ফাইল সংরক্ষণ
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(APP_FILES);
        })
    );

    self.skipWaiting();
});

// পুরোনো ক্যাশ পরিষ্কার
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names
                    .filter(function(name) {
                        return name !== CACHE_NAME;
                    })
                    .map(function(name) {
                        return caches.delete(name);
                    })
            );
        })
    );

    self.clients.claim();
});

// ইন্টারনেট না থাকলে ক্যাশ থেকে ফাইল দেখানো
self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});