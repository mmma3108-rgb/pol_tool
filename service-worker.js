const CACHE_NAME = "patrol-equipment-training-v42";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./home.html",
  "./equipment.html",
  "./styles.css",
  "./scripts/shared.js",
  "./scripts/login.js",
  "./scripts/home.js",
  "./scripts/equipment-page.js",
  "./data/equipment.js",
  "./data/organization.js",
  "./data/analytics.js",
  "./manifest.webmanifest",
  "./assets/jeonnam-police-ci.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const shouldPreferNetwork =
    event.request.mode === "navigate" ||
    [".html", ".js", ".css", ".webmanifest"].some((extension) => url.pathname.endsWith(extension));

  if (shouldPreferNetwork) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch(() => caches.match("./index.html")),
    ),
  );
});
