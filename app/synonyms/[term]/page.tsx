import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleContent } from "@/components/ArticleContent";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { SourceNote } from "@/components/SourceNote";
import { findRelatedWords } from "@/lib/api/datamuse";
import { ProviderError } from "@/lib/api/http";
import { getArticle, getArticles } from "@/lib/content";
import { pageMetadata, publicSiteUrl, SITE_NAME } from "@/lib/seo/site";
import { normalizeWord } from "@/lib/validation/input";

type PageProps = { params: Promise<{ term: string }> };

export function generateStaticParams() { return getArticles("synonyms").map((article) => ({ term: article.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const article = getArticle(term, "synonyms");
  if (article) return pageMetadata(article.title, article.description, `/synonyms/${article.slug}`, "article");
  const word = normalizeWord(term) || "Synonyms";
  const title = `Synonyms for ${word}`;
  const description = `Explore related alternatives to ${word}; context matters when choosing a synonym.`;
  return { ...pageMetadata(title, description, `/synonyms/${encodeURIComponent(word)}`), robots: { index: false, follow: true } };
}

export default async function SynonymResultPage({ params }: PageProps) {
  const { term } = await params;
  const article = getArticle(term, "synonyms");
  if (article) {
    const origin = publicSiteUrl();
    const schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, dateModified: article.reviewDate, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: SITE_NAME }, ...(origin ? { mainEntityOfPage: new URL(`/synonyms/${article.slug}`, origin).toString() } : {}) };
    const related = getArticles("synonyms").filter((entry) => entry.slug !== article.slug).slice(0, 3);
    return <><JsonLd data={schema} /><ArticleContent article={article} />
      {related.length ? <section className="section related-reading"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">Read next</p><h2>More synonym guides</h2></div></div>
        <div className="card-grid">{related.map((entry) => <ArticleCard key={entry.slug} article={entry} />)}</div>
      </div></section> : null}
    </>;
  }
  const word = normalizeWord(term);
  if (!word || word.includes(" ")) notFound();
  let results: Array<{ word: string; score: number }> = [];
  let error = "";
  try { results = await findRelatedWords(word, "synonyms"); }
  catch (cause) { error = cause instanceof ProviderError && cause.status === 429 ? "The provider is rate-limiting requests. Please wait and retry." : "The synonym provider is currently unavailable."; }
  return <div className="container page-main"><PageIntro eyebrow="Synonym finder" title={`Synonyms for ${word}`} description="Related words are suggestions. Their meaning and tone can differ, so check the sentence before substituting one." currentHref={`/synonyms/${encodeURIComponent(word)}`} />
    {error ? <p className="status-box error" role="alert">{error} <Link href="/tools/synonym-finder">Try the synonym tool again</Link>.</p> : results.length ? <ul className="result-list">{results.map((result) => <li key={result.word}><Link href={`/dictionary/${encodeURIComponent(result.word)}`}>{result.word}</Link></li>)}</ul> : <p className="status-box">The provider returned no synonym matches for this word.</p>}
    <SourceNote source="datamuse" /><div className="button-row"><Link className="button-secondary" href={`/dictionary/${encodeURIComponent(word)}`}>Open dictionary entry</Link><Link className="button-secondary" href="/antonyms">Find an antonym</Link></div>
  </div>;
}
