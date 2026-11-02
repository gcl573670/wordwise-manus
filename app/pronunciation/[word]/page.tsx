import type { Metadata } from "next";
import { DictionaryLookupView } from "@/components/DictionaryLookupView";
import { pageMetadata } from "@/lib/seo/site";
import { normalizeWord } from "@/lib/validation/input";

type PageProps = { params: Promise<{ word: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word: raw } = await params;
  const word = normalizeWord(raw) || "Pronunciation";
  const title = `${word} pronunciation and audio`;
  const description = `Available phonetic transcriptions and audio for ${word}, when returned by the dictionary provider.`;
  return { ...pageMetadata(title, description, `/pronunciation/${encodeURIComponent(word)}`), robots: { index: false, follow: true } };
}

export default async function PronunciationWordPage({ params }: PageProps) {
  const { word } = await params;
  return <DictionaryLookupView word={word} pronunciationOnly />;
}
