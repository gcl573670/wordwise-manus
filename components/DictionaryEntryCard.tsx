import type { DictionaryEntry } from "@/lib/api/dictionary";
import { CopyButton } from "@/components/CopyButton";

export function DictionaryEntryCard({ entry }: { entry: DictionaryEntry }) {
  const pronunciations = [...new Set([entry.phonetic, ...entry.phonetics.map((item) => item.text)].filter((value): value is string => !!value))];
  const copyText = [
    `Word: ${entry.word}`,
    ...(pronunciations.length ? [`Pronunciation: ${pronunciations.join(" · ")}`] : []),
    ...entry.meanings.flatMap((meaning) => meaning.definitions.map((definition) => `${meaning.partOfSpeech}: ${definition.definition}${definition.example ? `\nExample: ${definition.example}` : ""}`)),
  ].join("\n");
  return (
    <article className="definition-entry">
      <header className="definition-head">
        <h2>{entry.word}</h2>
        {entry.phonetic ? <span className="phonetic">/{entry.phonetic}/</span> : null}
        {entry.phonetics.map((item, index) => item.text || item.audio ? <div key={`${item.text || "audio"}-${index}`} className="phonetic-line">
          {item.text ? <span>/{item.text}/</span> : null}
          {item.audio ? <audio controls preload="none" src={item.audio}><a href={item.audio}>Play pronunciation audio</a></audio> : null}
        </div> : null)}
      </header>
      <CopyButton text={copyText} label="Copy word details" />
      {entry.meanings.map((meaning, index) => <section className="meaning-block" key={`${meaning.partOfSpeech}-${index}`}>
        <p className="part-of-speech">{meaning.partOfSpeech}</p>
        <ol>{meaning.definitions.map((definition, definitionIndex) => <li key={`${definition.definition}-${definitionIndex}`}>
          <p>{definition.definition}</p>
          {definition.example ? <blockquote>“{definition.example}”</blockquote> : null}
          {definition.synonyms.length ? <p className="related-label"><strong>Synonyms:</strong> {definition.synonyms.join(", ")}</p> : null}
          {definition.antonyms.length ? <p className="related-label"><strong>Antonyms:</strong> {definition.antonyms.join(", ")}</p> : null}
        </li>)}</ol>
      </section>)}
      <p className="source-note">Definitions, examples, phonetics, and audio are shown only when returned by the <a href="https://dictionaryapi.dev/" target="_blank" rel="noreferrer">Free Dictionary API</a>.</p>
    </article>
  );
}
