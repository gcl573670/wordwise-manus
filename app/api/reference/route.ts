import { NextRequest, NextResponse } from "next/server";
import { isMediaWikiEnabled, lookupWikiReference } from "@/lib/api/wiktionary";
import { ProviderError } from "@/lib/api/http";
import { REFERENCE_TOPICS } from "@/data/reference-topics";
import { getClientKey, takeRateLimit } from "@/lib/validation/rate-limit";
import { normalizeWord } from "@/lib/validation/input";

export async function GET(request: NextRequest) {
  const term = normalizeWord(request.nextUrl.searchParams.get("term"));
  if (!term || !REFERENCE_TOPICS.some((topic) => topic.toLocaleLowerCase("en-US") === term.toLocaleLowerCase("en-US"))) {
    return NextResponse.json({ status: "invalid", message: "Choose one of the curated reference topics." }, { status: 400 });
  }
  const client = getClientKey(request.headers);
  if (!takeRateLimit(`reference:${client}`, 10, 60_000)) return NextResponse.json({ status: "rate_limited", message: "Please wait before trying another reference lookup." }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    const reference = await lookupWikiReference(term);
    if (!reference) return NextResponse.json({ status: "not_found", message: "No encyclopedic reference was found for this curated topic." }, { status: 404 });
    return NextResponse.json({ status: "ok", reference, source: "Wikipedia / MediaWiki" }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    const upstreamLimited = error instanceof ProviderError && error.status === 429;
    const disabled = !isMediaWikiEnabled();
    const message = disabled
      ? "Wikipedia lookup is not enabled until the site operator supplies a valid contact URL or email."
      : upstreamLimited
        ? "Wikipedia is rate-limiting requests. Please wait before trying again."
        : "The reference service is temporarily unavailable. Please try again later.";
    return NextResponse.json(
      { status: upstreamLimited ? "rate_limited" : "unavailable", message, source: "Wikipedia / MediaWiki" },
      { status: upstreamLimited ? 429 : 503, ...(upstreamLimited ? { headers: { "Retry-After": "60" } } : {}) },
    );
  }
}
