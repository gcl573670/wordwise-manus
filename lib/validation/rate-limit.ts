type WindowEntry = { count: number; resetAt: number };
const buckets = new Map<string, WindowEntry>();

export function getClientKey(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.slice(0, 80);
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded || "unknown-client").slice(0, 80);
}

export function takeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  entry.count += 1;
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }
  return entry.count <= limit;
}
