import { ProviderError, requestJson } from "@/lib/api/http";

export interface GrammarMatch {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: Array<{ value: string }>;
  rule?: { id?: string; issueType?: string; category?: { name?: string } };
}
export interface GrammarCheckResult { matches: GrammarMatch[]; source: "LanguageTool" }
type RawGrammarResponse = { matches?: GrammarMatch[] };
const MAX_FORM_BYTES = 18_000;

export async function checkWithLanguageTool(text: string, language: string): Promise<GrammarCheckResult> {
  if (text.length > 20_000) throw new ProviderError("LanguageTool", 413, "LanguageTool accepts at most 20,000 characters per request.");
  const body = new URLSearchParams({ text, language: language || "en-US" });
  if (new TextEncoder().encode(body.toString()).byteLength > MAX_FORM_BYTES) {
    throw new ProviderError("LanguageTool", 413, "The encoded request is too large for the public LanguageTool service.");
  }
  const result = await requestJson<RawGrammarResponse>("LanguageTool", "https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });
  return { matches: Array.isArray(result.matches) ? result.matches : [], source: "LanguageTool" };
}
