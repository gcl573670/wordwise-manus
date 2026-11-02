"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/CopyButton";
import { WORD_BANK } from "@/data/word-bank";
import { ABBREVIATIONS, ACRONYMS, IDIOMS, VOCABULARY, type ReferenceEntry } from "@/lib/content";

type QuizQuestion = { correct: ReferenceEntry; options: ReferenceEntry[] };

function phraseWords(letters: string): string[] {
  const available = new Map<string, number>();
  for (const letter of letters) available.set(letter, (available.get(letter) || 0) + 1);
  return WORD_BANK.filter((word) => {
    const remaining = new Map(available);
    for (const letter of word) {
      const count = remaining.get(letter) || 0;
      if (!count) return false;
      remaining.set(letter, count - 1);
    }
    return true;
  }).sort((a, b) => b.length - a.length || a.localeCompare(b));
}

function ReferenceResults({ entries }: { entries: ReferenceEntry[] }) {
  if (!entries.length) return <p className="status-box">No matching entries are in this curated local collection.</p>;
  return <div className="reference-list">{entries.map((entry) => <article className="reference-card" key={entry.term}>
    <h2>{entry.term}</h2><p>{entry.meaning}</p><p className="example">“{entry.example}”</p>
    <p className="attribution"><a href={entry.source} target="_blank" rel="noreferrer">Source</a> · {entry.attribution} · {entry.license}</p>
    <CopyButton text={`${entry.term}: ${entry.meaning}\nExample: ${entry.example}\nSource: ${entry.source}`} label={`Copy ${entry.term}`} />
  </article>)}</div>;
}

export function LocalWordTool({ toolId }: { toolId: string }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [randomWord, setRandomWord] = useState("");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const localMatches = useMemo(() => {
    const query = value.trim().toLocaleLowerCase("en-US");
    if (!submitted || !query || toolId === "vocabulary-quiz-generator" || toolId === "random-word-generator") return [];
    if (toolId === "word-unscrambler") return phraseWords(query.replace(/[^a-z]/g, "")).slice(0, 80);
    if (toolId === "starts-with") return WORD_BANK.filter((word) => word.startsWith(query)).slice(0, 80);
    if (toolId === "ends-with") return WORD_BANK.filter((word) => word.endsWith(query)).slice(0, 80);
    if (toolId === "contains-letters") return WORD_BANK.filter((word) => word.includes(query)).slice(0, 80);
    if (toolId === "word-length-finder") {
      const length = Number.parseInt(query, 10);
      return Number.isFinite(length) && length > 0 && length <= 20 ? WORD_BANK.filter((word) => word.length === length).slice(0, 80) : [];
    }
    return [];
  }, [submitted, toolId, value]);

  const referenceEntries = toolId === "abbreviation-finder" ? ABBREVIATIONS : toolId === "acronym-finder" ? ACRONYMS : IDIOMS;
  const referenceMatches = useMemo(() => {
    const query = value.trim().toLocaleLowerCase("en-US");
    return referenceEntries.filter((entry) => !query || entry.term.toLocaleLowerCase("en-US").includes(query) || entry.meaning.toLocaleLowerCase("en-US").includes(query));
  }, [referenceEntries, value]);

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  function generateQuiz() {
    if (VOCABULARY.length < 4) return;
    const correct = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    const distractors = VOCABULARY.filter((entry) => entry.term !== correct.term).sort(() => Math.random() - .5).slice(0, 3);
    setQuestion({ correct, options: [correct, ...distractors].sort(() => Math.random() - .5) });
    setAnswer(null);
  }

  if (["abbreviation-finder", "acronym-finder", "idiom-finder"].includes(toolId)) {
    const label = toolId === "idiom-finder" ? "Search an idiom or meaning" : "Search a term or meaning";
    return <div className="tool-form"><div className="field"><label htmlFor={`ref-${toolId}`}>{label}</label><input id={`ref-${toolId}`} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Type to filter the local collection" /></div><ReferenceResults entries={referenceMatches} /></div>;
  }

  if (toolId === "random-word-generator") return <div className="tool-form"><p>Choose from the local spelling seed list; it is not a complete English dictionary.</p><div className="button-row"><button type="button" className="button-primary" onClick={() => setRandomWord(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)])}>Generate a word</button>{randomWord ? <a className="button-secondary" href={`/dictionary/${randomWord}`}>{randomWord} — look it up</a> : null}</div></div>;

  if (toolId === "vocabulary-quiz-generator") return <div className="tool-form"><p>Choose the word that matches the meaning. Questions use the site's small curated vocabulary set.</p><button type="button" className="button-primary" onClick={generateQuiz}>Generate a question</button>{question ? <div className="tool-output" aria-live="polite"><h3>Which word best fits this meaning?</h3><p><strong>{question.correct.meaning}</strong></p>{question.options.map((option) => <button className="quiz-option" type="button" key={option.term} onClick={() => setAnswer(option.term)} disabled={answer !== null}>{option.term}</button>)}{answer ? <p className={`status-box ${answer === question.correct.term ? "success" : "error"}`} role="status">{answer === question.correct.term ? "Correct." : `Not quite. The answer is ${question.correct.term}.`} <a href={question.correct.source} target="_blank" rel="noreferrer">Check the source</a>.</p> : null}</div> : null}</div>;

  const prompts: Record<string, { label: string; placeholder: string; help: string }> = {
    "word-unscrambler": { label: "Letters", placeholder: "e.g. listen", help: "Results use each supplied letter no more times than it appears. The local seed list is finite." },
    "starts-with": { label: "Starting letters", placeholder: "e.g. re", help: "Find words in the local seed list that begin with these letters." },
    "ends-with": { label: "Ending letters", placeholder: "e.g. ing", help: "Find words in the local seed list that end with these letters." },
    "contains-letters": { label: "Letters to find", placeholder: "e.g. light", help: "Find words in the local seed list containing this sequence." },
    "word-length-finder": { label: "Number of letters", placeholder: "e.g. 7", help: "Counts the spelling length in the local seed list." },
  };
  const prompt = prompts[toolId] || prompts["starts-with"];
  return <div className="tool-form"><form onSubmit={submit}><div className="form-row"><div className="field"><label htmlFor={`local-${toolId}`}>{prompt.label}</label><input id={`local-${toolId}`} value={value} onChange={(event) => { setValue(event.target.value); setSubmitted(false); }} placeholder={prompt.placeholder} maxLength={32} required /></div><button className="button-primary" type="submit">Find words</button></div></form><p className="source-note">{prompt.help} This tool makes no external request.</p>{submitted && !value.trim() ? <p className="status-box error" role="alert">Enter a value to search.</p> : null}{submitted && value.trim() && localMatches.length === 0 ? <p className="status-box">No matches were found in this local word list.</p> : null}{localMatches.length ? <div className="tool-output" aria-live="polite"><p>{localMatches.length} local match{localMatches.length === 1 ? "" : "es"} (maximum 80 shown)</p><ul className="result-list">{localMatches.map((word) => <li key={word}><a href={`/dictionary/${word}`}>{word}</a></li>)}</ul></div> : null}</div>;
}
