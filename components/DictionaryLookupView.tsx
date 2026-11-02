import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DictionaryEntryCard } from "@/components/DictionaryEntryCard";
import { PageIntro } from "@/components/PageIntro";
import { SearchBox } from "@/components/SearchBox";
import { SourceNote } from "@/components/SourceNote";
import { lookupDictionary } from "@/lib/api/dictionary";
import { normalizeWord } from "@/lib/validation/input";

export async function DictionaryLookupView({ word, pronunciationOnly = false }: { word: string; pronunciationOnly?: boolean }) {
  const safeWord = normalizeWord(word);
  const currentHref = `/${pronunciationOnly ? "pronunciation" : "dictionary"}/${encodeURIComponent(safeWord || word)}`;
  if (!safeWord || safeWord.includes(" ")) return <div className="container page-main"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dictionary" }]} /><p className="status-box error">Enter a single English word.</p><SearchBox compact /></div>;
  let result;
  try { result = await lookupDictionary(safeWord); }
  catch { return <div className="container page-main"><PageIntro eyebrow={pronunciationOnly ? "Pronunciation" : "Dictionary"} title={safeWord} description="This provider request could not be completed." currentHref={currentHref} /><p className="status-box error" role="alert">The dictionary service is temporarily unavailable. No definition or audio has been invented.</p><SearchBox compact /><SourceNote source="dictionary" /><div className="button-row"><Link className="button-secondary" href={`/synonyms/${encodeURIComponent(safeWord)}`}>Try synonyms</Link><Link className="button-secondary" href={`/antonyms/${encodeURIComponent(safeWord)}`}>Try antonyms</Link></div></div>; }
  const entries = result?.entries;
  if (!entries) return <div className="container page-main"><PageIntro eyebrow={pronunciationOnly ? "Pronunciation" : "Dictionary"} title={safeWord} description="No entry for this spelling was returned." currentHref={currentHref} /><p className="status-box">Try another spelling or search for a related word.</p><SearchBox compact /><SourceNote source="dictionary" /></div>;
  return <div className="container page-main"><PageIntro eyebrow={pronunciationOnly ? "Pronunciation" : "Dictionary"} title={safeWord} description={pronunciationOnly ? "Available phonetics and recordings returned by the dictionary provider." : `Definitions and supporting details returned by ${result?.source || "the dictionary provider"}.`} currentHref={currentHref} />
    {entries.map((entry, index) => <div key={`${entry.word}-${index}`} className="result-panel"><DictionaryEntryCard entry={entry} /></div>)}
    <div className="button-row" style={{ marginTop: 20 }}><Link className="button-secondary" href={`/synonyms/${encodeURIComponent(safeWord)}`}>Find synonyms</Link><Link className="button-secondary" href={`/antonyms/${encodeURIComponent(safeWord)}`}>Find antonyms</Link><Link className="button-secondary" href={`/pronunciation/${encodeURIComponent(safeWord)}`}>Pronunciation</Link></div>
  </div>;
}
