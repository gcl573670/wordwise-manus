import { NextRequest, NextResponse } from "next/server";
import { findRelatedWords, type WordQueryKind } from "@/lib/api/datamuse";
import { ProviderError } from "@/lib/api/http";
import { getClientKey, takeRateLimit } from "@/lib/validation/rate-limit";
import { normalizeWord } from "@/lib/validation/input";

const kinds = new Set<WordQueryKind>(["synonyms", "antonyms", "related", "association", "rhymes", "near-rhymes", "sounds-like"]);

export async function GET(request: NextRequest) {
  const term = normalizeWord(request.nextUrl.searchParams.get("term"));
  const kind = request.nextUrl.searchParams.get("kind") as WordQueryKind | null;
  if (!term || term.includes(" ") || !kind || !kinds.has(kind)) return NextResponse.json({ status: "invalid", message: "Choose a valid word and word-finding mode." }, { status: 400 });
  const client = getClientKey(request.headers);
  if (!takeRateLimit(`words:${client}`, 30, 60_000)) return NextResponse.json({ status: "rate_limited", message: "Too many word searches. Please wait a minute and try again." }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    const words = await findRelatedWords(term, kind);
    return NextResponse.json({ status: "ok", term, kind, words, source: "Datamuse API" }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    const upstreamLimited = error instanceof ProviderError && error.status === 429;
    return NextResponse.json(
      { status: upstreamLimited ? "rate_limited" : "unavailable", message: upstreamLimited ? "Datamuse is rate-limiting requests. Please wait and try again." : "The related-word service is temporarily unavailable. Please try again later.", source: "Datamuse API" },
      { status: upstreamLimited ? 429 : 503, ...(upstreamLimited ? { headers: { "Retry-After": "60" } } : {}) },
    );
  }
}
