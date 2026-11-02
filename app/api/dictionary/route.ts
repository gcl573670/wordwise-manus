import { NextRequest, NextResponse } from "next/server";
import { lookupDictionary } from "@/lib/api/dictionary";
import { ProviderError } from "@/lib/api/http";
import { getClientKey, takeRateLimit } from "@/lib/validation/rate-limit";
import { normalizeWord } from "@/lib/validation/input";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const word = normalizeWord(request.nextUrl.searchParams.get("word"));
  if (!word || word.includes(" ")) return NextResponse.json({ status: "invalid", message: "Enter one word using letters, apostrophes, or hyphens." }, { status: 400 });
  const client = getClientKey(request.headers);
  if (!takeRateLimit(`dictionary:${client}`, 40, 60_000)) return NextResponse.json({ status: "rate_limited", message: "Too many lookups. Please wait a minute and try again." }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    const result = await lookupDictionary(word);
    if (!result) return NextResponse.json({ status: "not_found", word, entries: [], source: "Free Dictionary API" }, { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
    return NextResponse.json({ status: "ok", word, entries: result.entries, source: result.source }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    const upstreamLimited = error instanceof ProviderError && error.status === 429;
    return NextResponse.json(
      { status: upstreamLimited ? "rate_limited" : "unavailable", message: upstreamLimited ? "The dictionary provider is rate-limiting requests. Please wait and try again." : "The dictionary service is temporarily unavailable. Please try again later.", source: "Free Dictionary API" },
      { status: upstreamLimited ? 429 : 503, ...(upstreamLimited ? { headers: { "Retry-After": "60" } } : {}) },
    );
  }
}
