"use client";

import { useMemo, useState, type FormEvent } from "react";
import { SourceNote } from "@/components/SourceNote";

type Match = { message: string; shortMessage?: string; offset: number; length: number; replacements: Array<{ value: string }>; rule?: { category?: { name?: string }; issueType?: string } };

function countSentences(text: string): number { return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter((part) => part.trim()).length; }
function countWords(text: string): number { return text.trim() ? text.trim().split(/\s+/u).length : 0; }
function titleLikeSentenceCase(text: string): string {
  return text.toLocaleLowerCase("en-US").replace(/(^|[.!?]\s+)([\p{L}])/gu, (_match, boundary: string, first: string) => boundary + first.toLocaleUpperCase("en-US"));
}
function localChecks(text: string): string[] {
  const notes: string[] = [];
  if (/\b([\p{L}]+)\s+\1\b/iu.test(text)) notes.push("Possible repeated word. Some repetitions are intentional, so review the sentence.");
  if (/[ \t]{2,}/.test(text)) notes.push("More than one consecutive space appears in the text.");
  if (/[!?]{2,}/.test(text)) notes.push("Multiple exclamation or question marks appear together; check whether that tone is intended.");
  if (text && /^\s|\s$/u.test(text)) notes.push("There is leading or trailing whitespace.");
  return notes;
}

export function WritingTool({ toolId }: { toolId: string }) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [externalError, setExternalError] = useState("");
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const counts = useMemo(() => {
    const paragraphs = text.split(/\n\s*\n/u).filter((part) => part.trim()).length;
    const words = countWords(text);
    const sentences = countSentences(text);
    return { words, characters: text.length, noSpaceCharacters: text.replace(/\s/gu, "").length, sentences, paragraphs, minutes: words ? Math.max(1, Math.ceil(words / 225)) : 0 };
  }, [text]);
  const notes = useMemo(() => localChecks(text), [text]);

  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setCopyMessage("Copied to clipboard."); }
    catch { setCopyMessage("Clipboard access is unavailable in this browser."); }
  }
  function convert(action: "sentence" | "upper" | "lower" | "format") {
    if (action === "sentence") setOutput(titleLikeSentenceCase(text));
    else if (action === "upper") setOutput(text.toLocaleUpperCase("en-US"));
    else if (action === "lower") setOutput(text.toLocaleLowerCase("en-US"));
    else setOutput(text.split("\n").map((line) => line.replace(/[\t ]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim());
    setCopyMessage("");
  }
  async function externalCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) { setExternalError("Enter text before checking."); return; }
    if (text.length > 20000) { setExternalError("LanguageTool's public endpoint accepts at most 20,000 characters per request."); return; }
    setBusy(true); setExternalError(""); setMatches([]);
    try {
      const response = await fetch("/api/grammar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, language }) });
      const result = await response.json() as { status?: string; matches?: Match[]; message?: string };
      if (!response.ok || result.status !== "ok") setExternalError(result.message || "LanguageTool is unavailable; the local checks below remain available.");
      else setMatches(result.matches || []);
    } catch { setExternalError("LanguageTool could not be reached. Your text was not saved by this tool."); }
    finally { setBusy(false); }
  }
  function applyReplacement(match: Match, replacement: string) {
    setText((current) => current.slice(0, match.offset) + replacement + current.slice(match.offset + match.length));
    setMatches([]);
  }

  const countOnly = ["word-counter", "character-counter", "sentence-counter", "paragraph-counter", "reading-time-calculator"].includes(toolId);
  const converter = ["sentence-case-converter", "case-converter", "text-formatter"].includes(toolId);
  const grammar = toolId === "basic-grammar-checker";
  const placeholder = grammar ? "Paste or type text to review…" : "Type or paste text here…";
  return <div className="tool-form">
    <div className="field"><label htmlFor={`writing-${toolId}`}>Text</label><textarea id={`writing-${toolId}`} className={grammar ? "large-text" : ""} value={text} onChange={(event) => { setText(event.target.value); setOutput(""); setMatches([]); setExternalError(""); setCopyMessage(""); }} placeholder={placeholder} /></div>
    {countOnly ? <div className="metrics" aria-live="polite">
      {(toolId === "word-counter" || toolId === "reading-time-calculator") ? <div className="metric"><strong>{counts.words}</strong><span>words</span></div> : null}
      {toolId === "character-counter" ? <><div className="metric"><strong>{counts.characters}</strong><span>characters including spaces</span></div><div className="metric"><strong>{counts.noSpaceCharacters}</strong><span>characters excluding spaces</span></div></> : null}
      {toolId === "sentence-counter" ? <div className="metric"><strong>{counts.sentences}</strong><span>sentences (punctuation-based estimate)</span></div> : null}
      {toolId === "paragraph-counter" ? <div className="metric"><strong>{counts.paragraphs}</strong><span>non-empty paragraphs</span></div> : null}
      {toolId === "reading-time-calculator" ? <div className="metric"><strong>{counts.minutes}</strong><span>minute{counts.minutes === 1 ? "" : "s"} at 225 words/minute</span></div> : null}
      <button type="button" className="button-secondary" onClick={() => copy(text)}>Copy text</button>
    </div> : null}
    {converter ? <div className="button-row">
      {toolId === "sentence-case-converter" ? <button className="button-secondary" type="button" onClick={() => convert("sentence")}>Convert to sentence case</button> : null}
      {toolId === "case-converter" ? <><button className="button-secondary" type="button" onClick={() => convert("upper")}>UPPERCASE</button><button className="button-secondary" type="button" onClick={() => convert("lower")}>lowercase</button></> : null}
      {toolId === "text-formatter" ? <button className="button-secondary" type="button" onClick={() => convert("format")}>Normalize spacing</button> : null}
      {output ? <button className="button-secondary" type="button" onClick={() => copy(output)}>Copy result</button> : null}
    </div> : null}
    {output ? <div className="field"><label htmlFor={`output-${toolId}`}>Result</label><textarea id={`output-${toolId}`} value={output} readOnly /></div> : null}
    {grammar ? <>
      <div className="trust-note"><strong>Privacy:</strong> local checks stay in this browser. If you choose the external check below, the text is sent to LanguageTool for proofreading. WordWise Hub does not save it; LanguageTool's own terms and privacy policy apply.</div>
      <div className="tool-output"><h3>Limited local checks</h3>{notes.length ? <ul>{notes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>{text.trim() ? "No issues from these simple local checks. This is not a full grammar review." : "Enter text to check spacing and possible repeated words locally."}</p>}</div>
      <SourceNote source="languagetool" note="The provider receives text only after you choose the external check." />
      <form onSubmit={externalCheck}><div className="form-row"><div className="field"><label htmlFor="language-select">English variety</label><select id="language-select" value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en-US">United States English</option><option value="en-GB">United Kingdom English</option><option value="en-CA">Canadian English</option><option value="en-AU">Australian English</option></select></div><button type="submit" className="button-primary" disabled={busy}>{busy ? "Checking…" : "Send text to LanguageTool"}</button></div></form>
      {externalError ? <p className="status-box error" role="alert">{externalError}</p> : null}
      {busy ? <p className="status-box" role="status">Sending this request for an on-demand LanguageTool check…</p> : null}
      {matches.length === 0 && !busy && !externalError && text.trim() ? <p className="source-note">LanguageTool results appear here after you request an external check. A clean result is not a guarantee of correctness.</p> : null}
      {matches.length ? <div className="tool-output" aria-live="polite"><h3>{matches.length} LanguageTool suggestion{matches.length === 1 ? "" : "s"}</h3><ol>{matches.map((match, index) => <li key={`${match.offset}-${index}`}><p>{match.message}{match.shortMessage ? ` (${match.shortMessage})` : ""}</p>{match.replacements.slice(0, 3).map((replacement) => <button className="button-quiet" type="button" key={replacement.value} onClick={() => applyReplacement(match, replacement.value)}>Replace with “{replacement.value}”</button>)}</li>)}</ol></div> : null}
    </> : null}
    {copyMessage ? <p className="status-box" role="status">{copyMessage}</p> : null}
  </div>;
}
