"use client";

import { useMemo, useState } from "react";
import type { ReferenceEntry } from "@/lib/content";

export function ReferenceDirectory({ entries, label = "Search terms" }: { entries: ReferenceEntry[]; label?: string }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("en-US");
    return entries.filter((entry) => !normalized || entry.term.toLocaleLowerCase("en-US").includes(normalized) || entry.meaning.toLocaleLowerCase("en-US").includes(normalized));
  }, [entries, query]);
  return <div className="tool-form"><div className="field"><label htmlFor="reference-search">{label}</label><input id="reference-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter this local collection" /></div>
    <p className="source-note">This is a finite curated collection. Each entry includes its source link and attribution/license notes.</p>
    {results.length ? <div className="reference-list" aria-live="polite">{results.map((entry) => <article className="reference-card" key={entry.term}><h2>{entry.term}</h2><p>{entry.meaning}</p><p className="example">“{entry.example}”</p><p className="attribution"><a href={entry.source} target="_blank" rel="noreferrer">Source</a> · {entry.attribution} · {entry.license}</p></article>)}</div> : <p className="status-box">No matching terms appear in this collection.</p>}
  </div>;
}
