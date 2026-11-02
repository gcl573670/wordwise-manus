import { withTtlCache } from "@/lib/cache/ttl";
import { requestJson } from "@/lib/api/http";

export type WordQueryKind = "synonyms" | "antonyms" | "related" | "association" | "rhymes" | "near-rhymes" | "sounds-like";
export interface RelatedWord { word: string; score: number }

export async function findRelatedWords(term: string, kind: WordQueryKind): Promise<RelatedWord[]> {
  const key = `datamuse:${kind}:${term.toLocaleLowerCase("en-US")}`;
  return withTtlCache(key, 7 * 24 * 60 * 60, async () => {
    const params = new URLSearchParams({ max: "50" });
    if (kind === "synonyms") params.set("rel_syn", term);
    else if (kind === "antonyms") params.set("rel_ant", term);
    else if (kind === "rhymes") params.set("rel_rhy", term);
    else if (kind === "near-rhymes") params.set("rel_nry", term);
    else if (kind === "sounds-like") params.set("sl", term);
    else if (kind === "association") params.set("rel_trg", term);
    else params.set("ml", term);
    const apiKey = process.env.DATAMUSE_API_KEY?.trim();
    if (apiKey) params.set("key", apiKey);
    const raw = await requestJson<Array<{ word?: unknown; score?: unknown }>>(
      "Datamuse",
      `https://api.datamuse.com/words?${params.toString()}`,
      { headers: { Accept: "application/json" } },
    );
    return raw.filter((item) => typeof item.word === "string").map((item) => ({
      word: item.word as string,
      score: typeof item.score === "number" ? item.score : 0,
    }));
  });
}
