const CACHE_NAME = "tokencalc-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./data/providers.json",
  "https://cdn.jsdelivr.net/npm/gpt-tokenizer@3.4.0/dist/o200k_base.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first pour rester à jour dès qu'une connexion existe ; retombe sur le
// cache seulement hors-ligne, et met à jour le cache à chaque réponse réseau valide.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
