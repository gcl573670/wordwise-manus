"use client";

import { useState, type FormEvent } from "react";
import { SourceNote } from "@/components/SourceNote";
import { REFERENCE_TOPICS } from "@/data/reference-topics";

type ReferenceResult = { title: string; extract: string; url: string; historyUrl: string; attribution: string; license: string; licenseUrl: string };

export function MediaWikiReferenceTool() {
  const [term, setTerm] = useState<string>(REFERENCE_TOPICS[0]);
  const [result, setResult] = useState<ReferenceResult | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setResult(null); setSearched(true);
    try {
      const response = await fetch(`/api/reference?term=${encodeURIComponent(term)}`);
      const payload = await response.json() as { status?: string; message?: string; reference?: ReferenceResult };
      if (!response.ok || payload.status !== "ok") setMessage(payload.message || "Reference lookup is unavailable.");
      else setResult(payload.reference || null);
    } catch { setMessage("The reference service could not be reached."); }
    finally { setBusy(false); }
  }

  return <section className="tool-panel" aria-labelledby="mediawiki-tool-title">
    <p className="eyebrow">Curated reference excerpts</p><h2 id="mediawiki-tool-title">Explore a reference topic</h2>
    <p>Choose one of the editorially selected topics. Live requests require an operator contact in the server environment; no arbitrary search terms are sent.</p>
    <form onSubmit={submit}><div className="form-row"><div className="field"><label htmlFor="mediawiki-topic">Reference topic</label><select id="mediawiki-topic" value={term} onChange={(event) => setTerm(event.target.value)}>{REFERENCE_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></div><button className="button-primary" type="submit" disabled={busy}>{busy ? "Loading…" : "Look up excerpt"}</button></div></form>
    {busy ? <p className="status-box" role="status">Loading a selected reference excerpt…</p> : null}
    {message ? <p className="status-box error" role="alert">{message}</p> : null}
    {searched && !busy && !message && !result ? <p className="status-box">No matching reference excerpt was returned.</p> : null}
    {result ? <article className="reference-card"><h3>{result.title}</h3><p>{result.extract}</p><p className="attribution">{result.attribution} <a href={result.url} target="_blank" rel="noreferrer">Source article</a> · <a href={result.historyUrl} target="_blank" rel="noreferrer">Page history</a> · <a href={result.licenseUrl} target="_blank" rel="noreferrer">{result.license}</a></p></article> : null}
    <SourceNote source="mediawiki" note="Only the fixed list above is eligible; excerpts are not a substitute for the full article." />
  </section>;
}
