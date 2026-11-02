import { NextRequest, NextResponse } from "next/server";
import { checkWithLanguageTool } from "@/lib/api/grammar";
import { ProviderError } from "@/lib/api/http";
import { readJsonBodyBounded } from "@/lib/validation/body";
import { getClientKey, takeRateLimit } from "@/lib/validation/rate-limit";
import { normalizeText } from "@/lib/validation/input";

export async function POST(request: NextRequest) {
  const client = getClientKey(request.headers);
  if (!takeRateLimit(`grammar:${client}`, 4, 60_000)) return NextResponse.json({ status: "rate_limited", message: "Please wait before submitting another external check." }, { status: 429, headers: { "Retry-After": "60", "Cache-Control": "no-store" } });
  const payload = await readJsonBodyBounded(request, 100_000);
  if (!payload.ok) {
    const tooLarge = payload.reason === "too_large";
    return NextResponse.json({ status: tooLarge ? "too_large" : "invalid", message: tooLarge ? "The request body is too large. Keep the text within the 20,000-character limit." : "Send a valid JSON request." }, { status: tooLarge ? 413 : 400, headers: { "Cache-Control": "no-store" } });
  }
  const body = payload.value as { text?: unknown; language?: unknown };
  const text = normalizeText(body?.text, 20000);
  if (text === null || text.length < 1) return NextResponse.json({ status: "invalid", message: "Enter up to 20,000 characters of text." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  const language = typeof body.language === "string" && ["en-US", "en-GB", "en-CA", "en-AU", "auto"].includes(body.language) ? body.language : "en-US";
  try {
    const result = await checkWithLanguageTool(text, language);
    return NextResponse.json({ status: "ok", ...result, privacy: "Text is sent to LanguageTool for this request only; WordWise Hub does not save it." }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    const message = error instanceof ProviderError && error.status === 413
      ? "This text exceeds the safe request-size limit for LanguageTool's public service. Shorten it and retry."
      : "LanguageTool is unavailable right now. Use the local checks below, which have limited coverage.";
    return NextResponse.json({ status: "unavailable", message, source: "LanguageTool" }, { status: 503, headers: { "Cache-Control": "no-store, private" } });
  }
}
