type CacheEntry<T> = { value: T; expiresAt: number };
const memoryCache = new Map<string, CacheEntry<unknown>>();
const MAX_MEMORY_ITEMS = 500;

function workerCache(): Cache | undefined {
  return (globalThis as typeof globalThis & { caches?: CacheStorage & { default?: Cache } }).caches?.default;
}

function cacheRequest(key: string): Request {
  return new Request(`https://wordwise-cache.invalid/${encodeURIComponent(key)}`);
}

export async function withTtlCache<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const memory = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memory && memory.expiresAt > now) return memory.value;
  if (memory) memoryCache.delete(key);

  const edge = workerCache();
  if (edge) {
    try {
      const cached = await edge.match(cacheRequest(key));
      if (cached) return await cached.json() as T;
    } catch {
      // Cache failures must not prevent a provider request.
    }
  }

  const value = await load();
  if (memoryCache.size >= MAX_MEMORY_ITEMS) {
    const first = memoryCache.keys().next().value;
    if (first) memoryCache.delete(first);
  }
  memoryCache.set(key, { value, expiresAt: now + ttlSeconds * 1000 });
  if (edge) {
    try {
      await edge.put(cacheRequest(key), new Response(JSON.stringify(value), {
        headers: { "Cache-Control": `public, max-age=${Math.max(1, ttlSeconds)}`, "Content-Type": "application/json" },
      }));
    } catch {
      // Cloudflare's cache is an optimization; the in-memory/result path remains valid.
    }
  }
  return value;
}
