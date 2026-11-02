import articleData from "@/content/articles.generated.json";
import abbreviationData from "@/data/abbreviations.json";
import acronymData from "@/data/acronyms.json";
import idiomData from "@/data/idioms.json";
import vocabularyData from "@/data/vocabulary.json";

export type ArticleCategory = "vocabulary" | "synonyms" | "grammar" | "writing" | "reference";
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  author: string;
  reviewDate: string;
  sources?: Array<{ title: string; url: string }>;
  body: string;
}
export interface ReferenceEntry {
  term: string;
  meaning: string;
  example: string;
  source: string;
  attribution: string;
  license: string;
  partOfSpeech?: string;
  phonetic?: string;
  related?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

export const ARTICLES = articleData as Article[];
export const ABBREVIATIONS = abbreviationData as ReferenceEntry[];
export const ACRONYMS = acronymData as ReferenceEntry[];
export const IDIOMS = idiomData as ReferenceEntry[];
export const VOCABULARY = vocabularyData as ReferenceEntry[];

export function getArticle(slug: string, category?: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug && (!category || article.category === category));
}

export function getArticles(category?: string): Article[] {
  return ARTICLES.filter((article) => !category || article.category === category)
    .sort((a, b) => b.reviewDate.localeCompare(a.reviewDate) || a.title.localeCompare(b.title));
}
