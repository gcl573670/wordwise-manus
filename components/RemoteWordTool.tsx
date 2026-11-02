"use client";

import { useState, type FormEvent } from "react";
import { DictionaryEntryCard } from "@/components/DictionaryEntryCard";
import { CopyButton } from "@/components/CopyButton";
import { SourceNote } from "@/components/SourceNote";
import type { DictionaryEntry } from "@/lib/api/dictionary";
import type { WordQueryKind } from "@/lib/api/datamuse";

type Mode = WordQueryKind | "pronunciation";
type RelatedResult = { word: string; score: number };

export function RemoteWordTool({ mode }: { mode: Mode }) {
  const [term, setTerm] = useState("");
  const [kind, setKind] = useState<"rhymes" | "near-rhymes" | "sounds-like">(mode === "rhymes" ? "rhymes" : "near-rhymes");
  const [words, setWords] = useState<RelatedResult[]>([]);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = term.trim();
    if (!clean || clean.length > 80) { setError("Enter a word of 1–80 characters."); return; }
    setBusy(true); setError(""); setSearched(true); setWords([]); setEntries([]);
    try {
      const response = mode === "pronunciation"
        ? await fetch(`/api/dictionary?word=${encodeURIComponent(clean)}`)
        : await fetch(`/api/words?term=${encodeURIComponent(clean)}&kind=${encodeURIComponent(mode === "rhymes" ? kind : mode)}`);
      const result = await response.json() as {
        status?: string; message?: string; words?: RelatedResult[]; entries?: DictionaryEntry[];
      };
      if (!response.ok || result.status === "unavailable" || result.status === "invalid") {
        setError(result.message || (response.status === 429 ? "Too many requests. Please wait and try again." : "The provider could not complete this lookup."));
      } else if (mode === "pronunciation") {
        setEntries(result.entries || []);
        if (result.status === "not_found") setError("No pronunciation entry was found for that word.");
      } else {
        setWords(result.words || []);
      }
    } catch {
      setError("The lookup could not reach its service. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="tool-form">
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="field"><label htmlFor={`remote-${mode}`}>Word</label><input id={`remote-${mode}`} value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Enter a word" maxLength={80} required /></div>
          {mode === "rhymes" ? <div className="field"><label htmlFor="rhyme-kind">Sound match</label><select id="rhyme-kind" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}><option value="rhymes">Perfect rhymes</option><option value="near-rhymes">Near rhymes</option><option value="sounds-like">Similar sounds</option></select></div> : null}
          <button className="button-primary" type="submit" disabled={busy}>{busy ? "Searching…" : mode === "pronunciation" ? "Find pronunciation" : "Find words"}</button>
        </div>
      </form>
      {mode === "pronunciation" ? <p className="source-note">Pronunciation text and audio appear only when the dictionary provider supplies them. Syllable counts are not estimated.</p> : null}
      {busy ? <p className="status-box" role="status">Loading provider results…</p> : null}
      {error ? <p className="status-box error" role="alert">{error}</p> : null}
      {searched && !busy && !error && mode !== "pronunciation" && words.length === 0 ? <p className="status-box">No matching words were returned for this query.</p> : null}
      {entries.length ? <div className="tool-output">{entries.map((entry, index) => <DictionaryEntryCard key={`${entry.word}-${index}`} entry={entry} />)}</div> : null}
      {words.length ? <div className="tool-output" aria-live="polite"><ul className="result-list">{words.map((item, index) => <li key={`${item.word}-${index}`}><a href={`/dictionary/${encodeURIComponent(item.word)}`}>{item.word}</a></li>)}</ul><CopyButton text={words.map((item) => item.word).join(", ")} label="Copy suggested words" /></div> : null}
      <SourceNote source={mode === "pronunciation" ? "dictionary" : "datamuse"} note={mode === "pronunciation" ? "Phonetics and audio appear only when the provider supplies them." : "Related words are suggestions; meaning and tone can differ by context."} />
    </div>
  );
}
