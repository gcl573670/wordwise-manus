import { withTtlCache } from "@/lib/cache/ttl";
import { ProviderError, requestJson } from "@/lib/api/http";

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}
export interface DictionaryMeaning { partOfSpeech: string; definitions: DictionaryDefinition[] }
export interface DictionaryPhonetic { text?: string; audio?: string }
export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrl: string;
}

type RawEntry = {
  word?: unknown;
  phonetic?: unknown;
  phonetics?: Array<{ text?: unknown; audio?: unknown }>;
  meanings?: Array<{ partOfSpeech?: unknown; definitions?: Array<{ definition?: unknown; example?: unknown; synonyms?: unknown; antonyms?: unknown }> }>;
};

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalize(entries: RawEntry[], requestedWord: string): DictionaryEntry[] {
  return entries.filter((entry) => typeof entry.word === "string").map((entry) => ({
    word: entry.word as string,
    ...(typeof entry.phonetic === "string" ? { phonetic: entry.phonetic } : {}),
    phonetics: (entry.phonetics || []).flatMap((item) => {
      const phonetic = {
        ...(typeof item.text === "string" ? { text: item.text } : {}),
        ...(typeof item.audio === "string" && item.audio ? { audio: item.audio.startsWith("//") ? `https:${item.audio}` : item.audio } : {}),
      };
      return Object.keys(phonetic).length ? [phonetic] : [];
    }),
    meanings: (entry.meanings || []).filter((meaning) => typeof meaning.partOfSpeech === "string").map((meaning) => ({
      partOfSpeech: meaning.partOfSpeech as string,
      definitions: (meaning.definitions || []).flatMap((definition) => typeof definition.definition === "string" ? [{
        definition: definition.definition,
        ...(typeof definition.example === "string" ? { example: definition.example } : {}),
        synonyms: strings(definition.synonyms),
        antonyms: strings(definition.antonyms),
      }] : []),
    })),
    sourceUrl: `https://dictionaryapi.dev/`,
  })).filter((entry) => entry.word.toLocaleLowerCase("en-US") === requestedWord.toLocaleLowerCase("en-US"));
}

export async function lookupDictionary(word: string): Promise<DictionaryEntry[] | null> {
  const key = `dictionary:${word.toLocaleLowerCase("en-US")}`;
  return withTtlCache(key, 7 * 24 * 60 * 60, async () => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    try {
      const raw = await requestJson<RawEntry[]>("Free Dictionary API", url);
      const entries = normalize(raw, word);
      return entries.length ? entries : null;
    } catch (error) {
      if (error instanceof ProviderError && error.status === 404) return null;
      throw error;
    }
  });
}
