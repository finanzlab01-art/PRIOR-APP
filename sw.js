// Cada vez que cambies íconos o fuentes, sube el número de CACHE.
const CACHE = "prior-v1";

// Se guardan al instalar para que la app abra sin conexión.
const PRECARGA = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECARGA)).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(nombres => Promise.all(nombres.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Red primero: el HTML siempre se busca nuevo; la copia guardada es solo para cuando no hay conexión.
async function redPrimero(req){
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put("/", res.clone());
    return res;
  } catch {
    return (await cache.match("/")) || Response.error();
  }
}

// Caché primero: íconos, fuentes y supabase-js con versión fija no cambian.
async function cachePrimero(req){
  const cache = await caches.open(CACHE);
  const guardada = await cache.match(req);
  if (guardada) return guardada;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") cache.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Supabase (cuentas y datos): siempre a la red, sin guardar.
  if (url.hostname.endsWith("supabase.co")) return;

  // index.html y navegaciones: red primero.
  if (req.mode === "navigate" || (url.origin === location.origin && (url.pathname === "/" || url.pathname === "/index.html"))) {
    e.respondWith(redPrimero(req));
    return;
  }

  // Íconos, manifest, fuentes de Google y supabase-js (versión fija): caché primero.
  if (
    (url.origin === location.origin && (url.pathname.startsWith("/icons/") || url.pathname === "/manifest.json")) ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com" ||
    (url.hostname === "cdn.jsdelivr.net" && url.pathname.startsWith("/npm/@supabase/supabase-js@2.117.2/"))
  ) {
    e.respondWith(cachePrimero(req));
    return;
  }

  // Todo lo demás: a la red, sin guardar.
});
