const CACHE_NAME = "patrol-equipment-training-v31";
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
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch(() => caches.match("./index.html")),
    ),
  );
});
