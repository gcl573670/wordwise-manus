import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { SourceNote } from "@/components/SourceNote";
import { findRelatedWords } from "@/lib/api/datamuse";
import { ProviderError } from "@/lib/api/http";
import { pageMetadata } from "@/lib/seo/site";
import { normalizeWord } from "@/lib/validation/input";

type PageProps = { params: Promise<{ word: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word: raw } = await params;
  const word = normalizeWord(raw) || "Word lookup";
  const title = `Antonyms for ${word}`;
  const description = `Explore possible antonyms for ${word}; opposites vary with meaning and context.`;
  return { ...pageMetadata(title, description, `/antonyms/${encodeURIComponent(word)}`), robots: { index: false, follow: true } };
}

export default async function AntonymWordPage({ params }: PageProps) {
  const { word: raw } = await params;
  const word = normalizeWord(raw);
  if (!word || word.includes(" ")) notFound();
  let results: Array<{ word: string; score: number }> = [];
  let error = "";
  try { results = await findRelatedWords(word, "antonyms"); }
  catch (cause) { error = cause instanceof ProviderError && cause.status === 429 ? "The provider is rate-limiting requests. Please wait and retry." : "The antonym provider is currently unavailable."; }
  return <div className="container page-main"><PageIntro eyebrow="Antonym finder" title={`Antonyms for ${word}`} description="Opposites depend on the sense of a word; check each candidate in context." currentHref={`/antonyms/${encodeURIComponent(word)}`} />
    {error ? <p className="status-box error" role="alert">{error}</p> : results.length ? <ul className="result-list">{results.map((result) => <li key={result.word}><Link href={`/dictionary/${encodeURIComponent(result.word)}`}>{result.word}</Link></li>)}</ul> : <p className="status-box">No antonym matches were returned for this word.</p>}
    <SourceNote source="datamuse" /><Link className="button-secondary" href={`/dictionary/${encodeURIComponent(word)}`}>Open dictionary entry</Link>
  </div>;
}
