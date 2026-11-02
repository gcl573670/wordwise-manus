import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { SearchBox } from "@/components/SearchBox";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("English Dictionary", "Search word definitions, parts of speech, available examples, phonetics, and pronunciation audio.", "/dictionary");
const suggestions = ["important", "affect", "effect", "beautiful", "resilient", "subtle"];

export default function DictionaryPage() {
  return <div className="container page-main"><PageIntro eyebrow="Dictionary" title="Look up an English word" description="Search a word to see definitions and other information returned by the Free Dictionary API. Missing audio, examples, or meanings are not filled in." currentHref="/dictionary" />
    <SearchBox compact />
    <section className="section"><h2>Words to try</h2><p>These are example searches, not a traffic ranking.</p><div className="topic-strip">{suggestions.map((word) => <Link className="topic-chip" href={`/dictionary/${word}`} key={word}><strong>{word}</strong><span>Open dictionary entry</span></Link>)}</div></section>
    <p className="source-note">Source: <a href="https://dictionaryapi.dev/" target="_blank" rel="noreferrer">Free Dictionary API</a>. Provider responses may vary by word and regional usage.</p>
  </div>;
}
