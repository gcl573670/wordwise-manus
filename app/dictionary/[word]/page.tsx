import type { Metadata } from "next";
import { DictionaryLookupView } from "@/components/DictionaryLookupView";
import { lookupDictionary } from "@/lib/api/dictionary";
import { pageMetadata } from "@/lib/seo/site";
import { normalizeWord } from "@/lib/validation/input";

type PageProps = { params: Promise<{ word: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word: rawWord } = await params;
  const word = normalizeWord(rawWord) || "Word lookup";
  let description = `Look up meanings and any returned examples or phonetics for ${word}.`;
  try {
    const entries = await lookupDictionary(word);
    if (entries?.[0]?.meanings[0]?.definitions[0]?.definition) description = entries[0].meanings[0].definitions[0].definition;
  } catch { /* Keep a truthful general description when the provider is down. */ }
  return { ...pageMetadata(`${word} — meaning and pronunciation`, description, `/dictionary/${encodeURIComponent(word)}`), robots: { index: false, follow: true } };
}

export default async function DictionaryWordPage({ params }: PageProps) {
  const { word } = await params;
  return <DictionaryLookupView word={word} />;
}
