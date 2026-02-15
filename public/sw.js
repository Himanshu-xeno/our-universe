const CACHE_NAME = "our-universe-v1";

// Files to cache for offline use
const STATIC_ASSETS = [
  "/",
  "/universe",
  "/letters",
  "/manifest.json",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached version or fetch from network
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
            return response;
          })
          .catch(() => {
            // If offline and no cache, return the main page
            if (event.request.mode === "navigate") {
              return caches.match("/");
            }
            return new Response("Offline", { status: 503 });
          })
      );
    })
  );
});